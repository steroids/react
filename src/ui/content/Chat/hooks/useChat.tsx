import React, {useCallback, useEffect, useState} from 'react';
import dayjs from 'dayjs';
import _uniqueId from 'lodash-es/uniqueId';
import {useDispatch} from '../../../../hooks';
import {formReset} from '../../../../actions/form';
import {IChatMessage, IChatUser} from '../Chat';
import {getMessagesGroupedByDate, setNewMessageIntoGroupedMessages} from '../utils';
import {ISO_TIMESTAMP_TEMPLATE} from '../constants/timeTemplatesAndUnits';

export interface IChatConfig {
    chatId: string;
    messages: IChatMessage[];
    currentUser: IChatUser;
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

    const dispatch = useDispatch();

    const onSendMessage = useCallback((rawMessage) => {
        const newMessage = {
            ...rawMessage,
            id: _uniqueId(),
            user: config.currentUser,
            timestamp: dayjs().format(ISO_TIMESTAMP_TEMPLATE),
            isFirstMessage: true,
            isLastMessage: true,
        };

        setGroupedMessagesByDates((prevGroupedMessagesByDates) => setNewMessageIntoGroupedMessages(newMessage, prevGroupedMessagesByDates));

        dispatch(formReset(config.chatId));
    }, [dispatch, config.chatId, config.currentUser]);

    return {
        groupedMessagesByDates,
        onSendMessage,
    };
};

export default useChat;
