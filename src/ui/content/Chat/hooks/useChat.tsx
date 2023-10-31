import React, {useEffect, useState} from 'react';
import {IChatMessage} from '../Chat';
import {getMessagesGroupedByDate} from '../utils';

export interface IChatConfig {
    messages: IChatMessage[];
}

export interface IGroupedMessage extends IChatMessage {
    isFirstMessage?: boolean;
    isLastMessage?: boolean;
}

export type IGroupedMessagesByDates = Record<string, IGroupedMessage[][]>

const useChat = (config: IChatConfig) => {
    const [groupedMessagesByDates, setGroupedMessagesByDates] = useState({});

    useEffect(() => setGroupedMessagesByDates(
        getMessagesGroupedByDate(config.messages),
    ), [config.messages]);

    return {
        groupedMessagesByDates,
    };
};

export default useChat;
