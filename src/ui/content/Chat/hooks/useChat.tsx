import React, {useEffect, useState} from 'react';
import {IChatMessage, IChatUser} from '@steroidsjs/core/ui/content/Chat/Chat';
import {getBubblesGroupedByDate} from '../utils';

export interface IUseChatConfig {
    chatId: string;
    messages: IChatMessage[];
    currentUser: IChatUser;
}

export interface IBubbleMessage extends IChatMessage {
    isFirstMessage?: boolean;
    isLastMessage?: boolean;
}

export type IBubbleMessagesByDates = Record<string, IBubbleMessage[][]>

export default function useChat(props: IUseChatConfig) {
    const [bubbleMessagesByDates, setBubbleMessagesByDates] = useState([]);

    useEffect(() => {
        const preparedMessages = getBubblesGroupedByDate(props.messages);

        setBubbleMessagesByDates(preparedMessages);
    }, [props.messages]);

    return {
        bubbleMessagesByDates,
    };
}
