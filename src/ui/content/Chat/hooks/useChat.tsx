import React, {useEffect, useState} from 'react';
import {IChatMessage} from '../Chat';
import {groupMessagesByDate} from '../utils';

export interface IChatConfig {
    messages: IChatMessage[];
}

export interface IGroupedMessage extends IChatMessage {
    isFirstMessage?: boolean;
    isLastMessage?: boolean;
}

export type IGroupedMessagesByDates = Record<string, IGroupedMessage[][]>

export default function useChat(config: IChatConfig) {
    const [groupedMessagesByDates, setGroupedMessagesByDates] = useState({});

    useEffect(() => {
        setGroupedMessagesByDates(
            groupMessagesByDate(config.messages),
        );
    }, [config.messages]);

    return {
        groupedMessagesByDates,
    };
}
