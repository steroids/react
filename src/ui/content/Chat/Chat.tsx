import React from 'react';
import {useComponents} from '../../../hooks';
import {IAvatarProps} from '../Avatar/Avatar';
import useChat, {IChatConfig, IGroupedMessagesByDates} from './hooks/useChat';

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
    timestamp: Date;
}

interface IChatProps extends IChatConfig, IUiComponent {
    chatId: string;
    currentUser: IChatUser;
}

export interface IChatViewProps extends Omit<IChatProps, 'messages'>{
    groupedMessagesByDates: IGroupedMessagesByDates;
}

export default function Chat(props: IChatProps) {
    const components = useComponents();

    const {
        groupedMessagesByDates,
    } = useChat({
        messages: props.messages,
    });

    return components.ui.renderView(props.view || 'content.ChatView', {
        ...props,
        groupedMessagesByDates,
    });
}
