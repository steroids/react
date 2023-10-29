import React from 'react';
import {useComponents} from '../../../hooks';
import useChat, {IBubbleMessagesByDates, IUseChatConfig} from './hooks/useChat';

export interface IChatUser {
    id: number;
    firstName?: string;
    lastName?: string;
    isOnline?: boolean;
    avatar?: {
        src: string;
    }
}

export interface IChatMessage {
    id: number;
    user: IChatUser;
    text: string;
    timestamp: Date;
}

interface IChatProps extends IUseChatConfig, IUiComponent {
    currentUser: IChatUser;
}

export interface IChatViewProps extends Omit<IChatProps, 'messages'>{
    bubbleMessagesByDates: IBubbleMessagesByDates;
}

export default function Chat(props: IChatProps) {
    const components = useComponents();

    const {
        bubbleMessagesByDates,
    } = useChat({
        chatId: props.chatId,
        messages: props.messages,
        currentUser: props.currentUser,
    });

    return components.ui.renderView(props.view || 'content.ChatView', {
        ...props,
        bubbleMessagesByDates,
    });
}
