import React from 'react';
import {useComponents} from '../../../hooks';
import {IAvatarProps} from '../Avatar/Avatar';
import useChat, {IGroupedMessagesByDates} from './hooks/useChat';

export interface IChatUser {
    id: number;
    firstName?: string;
    lastName?: string;
    avatar?: IAvatarProps;
}

export interface IChatMessage {
    id: number;
    user: IChatUser;
    text: string;
    timestamp: Date | string;
}

/**
 * Chat
 *
 * Комплексный компонент Чат предназначен для коммуникации пользователей с помощью текстовых сообщений.
 */
export interface IChatProps extends IUiComponent {
    /**
     * Идентификатор чата
     * @example TaskChat
     */
    chatId: string;

    /**
     * Коллекция сообщений,
     * @example [
     *  {
     *         id: 1,
     *         text: 'Всем привет!',
     *         user: {
     *             id: 1,
     *             firstName: 'Olga',
     *             lastName: 'Petrova',
     *             avatar: {
     *                 src: 'images.com/image.png',
     *                 status: true,
     *             },
     *         },
     *         timestamp: '2023-10-25T12:38:00',
     *     },
     * ]
     */
    messages: IChatMessage[];

    /**
     * Данные о текущем пользователе, нужны для отправки сообщений и определения сообщений пользователя
     * @example {
     *             id: 1,
     *             firstName: 'Olga',
     *             lastName: 'Petrova',
     *             avatar: {
     *                 src: 'images.com/image.png',
     *                 status: true,
     *             },
     *         }
     */
    currentUser: IChatUser;

    /**
     * Обработчик события отправки сообщения
     */
    onSendMessage?: (chatId: string, message: IChatMessage) => void;
}

export interface IChatViewProps extends Omit<IChatProps, 'messages'>{
    groupedMessagesByDates: IGroupedMessagesByDates;
    onSendMessage: (data) => void;
}

export default function Chat(props: IChatProps) {
    const components = useComponents();

    const {
        onSendMessage,
        groupedMessagesByDates,
    } = useChat({
        chatId: props.chatId,
        messages: props.messages,
        currentUser: props.currentUser,
        onSendMessage: props.onSendMessage,
    });

    return components.ui.renderView(props.view || 'content.ChatView', {
        ...props,
        groupedMessagesByDates,
        onSendMessage,
    });
}
