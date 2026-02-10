import {IChatMessage} from '@steroidsjs/core/ui/content/Chat/Chat';
import dayjs from 'dayjs';
import _last from 'lodash-es/last';

import {MONTH_AND_DAY_TEMPLATE} from '../constants/timeTemplatesAndUnits';
import {IGroupedMessage, IGroupedMessagesByDates} from '../hooks/useChat';
import {isWithinTimeThreshold} from '../utils/getMessagesGroupedByDate';

const addMessageToExistingGroup = (newMessage: IGroupedMessage, groupedMessagesByDates: IGroupedMessagesByDates, dateKey: string) => {
    const currentGroupedMessagesByDates = [...groupedMessagesByDates[dateKey]];

    // last array of messages for this date
    const lastMessageGroup = currentGroupedMessagesByDates.pop();

    // last message for this date
    const lastMessageFromGroup = _last(lastMessageGroup);

    let messagesGroupForCurrentDate = [...groupedMessagesByDates[dateKey], [newMessage]];

    if (isWithinTimeThreshold(lastMessageFromGroup, newMessage)) {
        // make a new message the last in the group
        delete lastMessageFromGroup.isLastMessage;
        delete newMessage.isFirstMessage;

        if (lastMessageGroup.length === 1) {
            messagesGroupForCurrentDate = [...currentGroupedMessagesByDates, [lastMessageFromGroup, newMessage]];
        } else {
            messagesGroupForCurrentDate = [...currentGroupedMessagesByDates, [...lastMessageGroup, newMessage]];
        }
    }

    return {
        ...groupedMessagesByDates,
        [dateKey]: messagesGroupForCurrentDate,
    };
};

export const addNewMessageIntoGroupedMessages = (newMessage: IChatMessage, groupedMessagesByDates: IGroupedMessagesByDates) => {
    const dateKey = dayjs(newMessage.timestamp).format(MONTH_AND_DAY_TEMPLATE);

    const singleMessageInGroup = {
        ...newMessage,
        isFirstMessage: true,
        isLastMessage: true,
    };

    if (groupedMessagesByDates[dateKey]) {
        return addMessageToExistingGroup(singleMessageInGroup, groupedMessagesByDates, dateKey);
    }

    return {
        ...groupedMessagesByDates,
        [dateKey]: [[singleMessageInGroup]],
    };
};
