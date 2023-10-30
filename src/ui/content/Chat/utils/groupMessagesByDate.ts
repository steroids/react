import _first from 'lodash-es/first';
import _last from 'lodash-es/last';
import dayjs from 'dayjs';
import {IGroupedMessagesByDates} from '../hooks/useChat';
import {MONTH_AND_DAY_TEMPLATE, SECONDS_IN_MINUTE_VALUE} from '../constants/timeTemplatesAndUnits';
import {IChatMessage} from '../Chat';

function isWithinTimeThreshold(firstMessage: IChatMessage, secondMessage: IChatMessage) {
    const firstMessageTime = new Date(firstMessage.timestamp).getTime();
    const secondMessageTime = new Date(secondMessage.timestamp).getTime();

    return firstMessage.user.id === secondMessage.user.id && Math.abs(firstMessageTime - secondMessageTime) <= SECONDS_IN_MINUTE_VALUE;
}

function addFirstAndLastKeyForMessageGroup(messageGroup: any) {
    _first(messageGroup).isFirstMessage = true;
    _last(messageGroup).isLastMessage = true;
}

export function groupMessagesByDate(messages: IChatMessage[]) {
    const groupedMessages = {} as IGroupedMessagesByDates;

    let prevDateKey = null;

    messages.forEach((message) => {
        const dateKey = dayjs(message.timestamp).format(MONTH_AND_DAY_TEMPLATE);

        if (!groupedMessages[dateKey]) {
            groupedMessages[dateKey] = [];
        }

        // array of grouped messages for dateKey
        const messagesGroupFromDate = groupedMessages[dateKey];

        // last group of messages
        const lastMessageGroup = _last(messagesGroupFromDate);

        // add fields to the last group of messages for the previous date
        if (!lastMessageGroup && prevDateKey) {
            addFirstAndLastKeyForMessageGroup(_last(groupedMessages[prevDateKey]));
        }

        const lastMessageFromGroup = _last(lastMessageGroup);

        // if time difference between messages is less than a minute, and they are from the same user
        if (lastMessageFromGroup && isWithinTimeThreshold(lastMessageFromGroup, message)) {
            lastMessageGroup.push(message);
        } else if (lastMessageGroup) {
            // add fields to the previous group of messages for the same date
            addFirstAndLastKeyForMessageGroup(lastMessageGroup);

            messagesGroupFromDate.push([message]);
        } else {
            prevDateKey = dateKey;

            messagesGroupFromDate.push([message]);
        }
    });

    // add fields to the last group of messages
    addFirstAndLastKeyForMessageGroup(_last(groupedMessages[prevDateKey]));

    return groupedMessages;
}
