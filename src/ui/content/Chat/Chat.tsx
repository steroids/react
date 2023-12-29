import React, {useCallback, useMemo} from 'react';
import {IFileFieldProps} from '../../form/FileField/FileField';
import {useComponents} from '../../../hooks';
import {IAvatarProps} from '../Avatar/Avatar';
import useChat, {IGroupedMessagesByDates} from './hooks/useChat';

export interface IChatUser {
    id: number,
    firstName?: string,
    lastName?: string,
    avatar?: IAvatarProps,
}

export interface IMessageFile {
    uid?: string,
    title?: string,
    size?: number,
    url?: string,
    downloadUrl?: string,
    fullHeight?: number,
    fullWidth?: number,
}

export interface IChatMessage {
    id: number,
    user: IChatUser,
    text: string,
    timestamp: Date | string,
    files?: IMessageFile[],
}

/**
 * Chat
 *
 * Комплексный компонент `Chat` предназначен для коммуникации пользователей с помощью текстовых сообщений.
 */
export interface IChatProps extends IUiComponent {
    /**
     * Идентификатор чата
     * @example TaskChat
     */
    chatId: string,

    /**
     * Коллекция сообщений
     * @example
     * [
     *  {
     *   id: 1,
     *   text: 'Всем привет!',
     *   files: [
     *      {
     *       id: 929,
     *       uid: 'c46f3d14-5891-4601-9e98-06f2c1e70a07',
     *       title: 'image.jpg',
     *       url: 'https://kozhin.dev/files/uploaded/c46f3d14-5891-4601-9e98-06f2c1e70a07.jpg',
     *       size: 47305,
     *      }
     *   ],
     *   user: {
     *     id: 1,
     *     firstName: 'Olga',
     *     lastName: 'Petrova',
     *     avatar: {
     *       src: 'images.com/image.png',
     *       status: true,
     *     },
     *   },
     *   timestamp: '2023-10-25T12:38:00',
     *  },
     * ]
     */
    messages: IChatMessage[],

    /**
     * Данные о текущем пользователе, нужны для отправки сообщений и определения сообщений пользователя
     * @example
     * {
     *  id: 1,
     *  firstName: 'Olga',
     *  lastName: 'Petrova',
     *  avatar: {
     *    src: 'images.com/image.png',
     *    status: true,
     *  },
     * }
     */
    currentUser: IChatUser,

    /**
     * Обработчик события отправки сообщения
     */
    onSendMessage?: (chatId: string, message: IChatMessage) => void,

    /**
     * Переопределение view React компонента для кастомизации отображения элемента инпута
     * @example MyCustomView
     */
    customChatInputView?: React.ReactNode,

    /**
     * Кастомный placeholder для инпута
     */
    customInputPlaceholder?: string,

    /**
     * Пропсы для инпута загрузки файлов
     */
    fileFieldProps?: IFileFieldProps,
}

export interface IChatViewProps extends Pick<IChatProps, 'currentUser'>{
    groupedMessagesByDates: IGroupedMessagesByDates,
    renderChatInput: () => JSX.Element,
}

export interface IChatInputViewProps extends Pick<IChatProps, 'chatId' | 'fileFieldProps'> {
    onSendMessage: (data) => void,
    onUploadFiles: (files) => void,
    inputPlaceholder: string,
}

export default function Chat(props: IChatProps) {
    const components = useComponents();

    const {
        onSendMessage,
        onUploadFiles,
        groupedMessagesByDates,
    } = useChat({
        chatId: props.chatId,
        messages: props.messages,
        currentUser: props.currentUser,
        onSendMessage: props.onSendMessage,
    });

    const ChatInputView = props.customChatInputView || components.ui.getView('content.ChatInputView');
    const renderChatInput = useCallback(() => (
        <ChatInputView
            chatId={props.chatId}
            onSendMessage={onSendMessage}
            onUploadFiles={onUploadFiles}
            fileFieldProps={props.fileFieldProps}
            inputPlaceholder={props.customInputPlaceholder || __('Введите сообщение')}
        />
    ), [ChatInputView, onSendMessage, onUploadFiles, props.chatId, props.customInputPlaceholder, props.fileFieldProps]);

    const viewProps = useMemo(() => ({
        currentUser: props.currentUser,
        groupedMessagesByDates,
        onSendMessage,
        renderChatInput,
        className: props.className,
        style: props.style,
    }), [groupedMessagesByDates, onSendMessage, props.className, props.currentUser, props.style, renderChatInput]);

    return components.ui.renderView(props.view || 'content.ChatView', viewProps);
}
