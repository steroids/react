import _mapValues from 'lodash-es/mapValues';
import _groupBy from 'lodash-es/groupBy';
import _first from 'lodash-es/first';
import _last from 'lodash-es/last';
import dayjs from 'dayjs';
import {
    MONTH_AND_DAY_TEMPLATE,
    SECONDS_IN_MINUTE_VALUE,
} from '../constants/timeTemplatesAndUnits';
import {IChatMessage} from '../Chat';

export function isWithinTimeThreshold(firstMessage: IChatMessage, secondMessage: IChatMessage) {
    const firstMessageTime = new Date(firstMessage.timestamp).getTime();
    const secondMessageTime = new Date(secondMessage.timestamp).getTime();

    return firstMessage.user.id === secondMessage.user.id && Math.abs(firstMessageTime - secondMessageTime) <= SECONDS_IN_MINUTE_VALUE;
}

export function convertMessagesIntoBubbles(messages: IChatMessage[]) {
    const bubbles = [];
    let index = 0;

    while (index < messages.length) {
        const message = messages[index];
        const nestedBubbles = [];

        nestedBubbles.push(message);

        for (let i = index + 1; i < messages.length; i += 1) {
            const nextMessage = messages[i];

            if (isWithinTimeThreshold(message, nextMessage)) {
                nestedBubbles.push(nextMessage);
            } else {
                break;
            }
        }

        _first(nestedBubbles).isFirstMessage = true;
        _last(nestedBubbles).isLastMessage = true;

        bubbles.push(nestedBubbles);

        index += nestedBubbles.length;
    }

    return bubbles;
}

export function getBubblesGroupedByDate(rawMessages: IChatMessage[]) {
    const messagesGroupedByDate = _groupBy(
        rawMessages,
        (message) => dayjs(message.timestamp).format(MONTH_AND_DAY_TEMPLATE),
    );

    return _mapValues(messagesGroupedByDate, (messages) => convertMessagesIntoBubbles(messages));
}
