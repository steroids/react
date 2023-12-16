import React, {useCallback, useEffect, useState} from 'react';
import dayjs from 'dayjs';
import _uniqueId from 'lodash-es/uniqueId';
import _isEqual from 'lodash-es/isEqual';
import File from 'fileup-core/lib/models/File';
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

export default function useChat(config: IChatConfig) {
    const dispatch = useDispatch();

    const [groupedMessagesByDates, setGroupedMessagesByDates] = useState({});

    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => setGroupedMessagesByDates(
        getMessagesGroupedByDate(config.messages),
    ), [config.messages]);

    const onUploadFiles = useCallback((files) => {
        if (!_isEqual(uploadedFiles, files)) {
            setUploadedFiles(files);
        }
    }, [uploadedFiles]);

    const onSendMessage = useCallback((rawMessage) => {
        if (!rawMessage) {
            return;
        }

        const newMessage: IChatMessage = {
            ...rawMessage,
            id: _uniqueId(),
            user: config.currentUser,
            timestamp: dayjs().format(ISO_TIMESTAMP_TEMPLATE),
            files: uploadedFiles?.reduce((acc, file) => {
                if (file.getResult() !== File.RESULT_ERROR) {
                    acc.push({
                        ...file._resultHttpMessage,
                    });
                }

                return acc;
            }, []) || null,
        };

        if (config.onSendMessage) {
            config.onSendMessage(config.chatId, newMessage);
        }

        setGroupedMessagesByDates((prevGroupedMessagesByDates) => addNewMessageIntoGroupedMessages(newMessage, prevGroupedMessagesByDates));

        dispatch(formReset(config.chatId));
    }, [config, dispatch, uploadedFiles]);

    return {
        groupedMessagesByDates,
        onSendMessage,
        onUploadFiles,
    };
}
