import React, {useCallback, useEffect, useState} from 'react';
import dayjs from 'dayjs';
import _uniqueId from 'lodash-es/uniqueId';
import {useDispatch} from '../../../../hooks';
import {formReset} from '../../../../actions/form';
import {IChatMessage, IChatProps} from '../Chat';
import {getMessagesGroupedByDate, addNewMessageIntoGroupedMessages} from '../utils';
import {ISO_TIMESTAMP_TEMPLATE} from '../constants/timeTemplatesAndUnits';

export type IChatConfig = Pick<IChatProps, 'chatId' | 'messages' | 'currentUser' | 'onSendMessage'>

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
        const newMessage: IChatMessage = {
            ...rawMessage,
            id: _uniqueId(),
            user: config.currentUser,
            timestamp: dayjs().format(ISO_TIMESTAMP_TEMPLATE),
        };

        if (config.onSendMessage) {
            config.onSendMessage(config.chatId, newMessage);
        }

        setGroupedMessagesByDates((prevGroupedMessagesByDates) => addNewMessageIntoGroupedMessages(newMessage, prevGroupedMessagesByDates));

        dispatch(formReset(config.chatId));
    }, [config, dispatch]);

    return {
        groupedMessagesByDates,
        onSendMessage,
    };
};

export default useChat;
