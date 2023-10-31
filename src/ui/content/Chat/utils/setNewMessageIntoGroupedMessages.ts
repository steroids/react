import dayjs from 'dayjs';
import _last from 'lodash-es/last';

import {isWithinTimeThreshold} from '../utils/getMessagesGroupedByDate';
import {MONTH_AND_DAY_TEMPLATE} from '../constants/timeTemplatesAndUnits';
import {IGroupedMessagesByDates} from '../hooks/useChat';

export const setNewMessageIntoGroupedMessages = (newMessage, groupedMessagesByDates: IGroupedMessagesByDates) => {
    const dateKey = dayjs(newMessage.timestamp).format(MONTH_AND_DAY_TEMPLATE);

    if (groupedMessagesByDates[dateKey]) {
        const currentGroupedMessagesByDates = [...groupedMessagesByDates[dateKey]];

        // last array of messages for this date
        const lastMessageGroup = currentGroupedMessagesByDates.pop();

        // last bubble of messages for this date
        const lastMessageFromGroup = _last(lastMessageGroup);

        let messagesGroupForCurrentDate = [...groupedMessagesByDates[dateKey], [newMessage]];

        if (isWithinTimeThreshold(lastMessageFromGroup, newMessage)) {
            // make a new message the last in the group
            delete lastMessageFromGroup.isLastMessage;
            delete newMessage.isFirstMessage;

            messagesGroupForCurrentDate = lastMessageGroup.length === 1
                ? [...currentGroupedMessagesByDates, [lastMessageFromGroup, newMessage]]
                : [...currentGroupedMessagesByDates, [...lastMessageGroup, newMessage]];
        }

        return {
            ...groupedMessagesByDates,
            [dateKey]: messagesGroupForCurrentDate,
        };
    }

    return {
        ...groupedMessagesByDates,
        [dateKey]: [
            [newMessage],
        ],
    };
};
