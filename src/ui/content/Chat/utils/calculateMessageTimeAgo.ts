import dayjs from 'dayjs';
import {
    HOUR_UNIT,
    HOURS_AND_MINUTES_TEMPLATE,
    HOURS_IN_DAY_VALUE,
    MINUTE_UNIT,
    MINUTES_IN_HOUR_VALUE,
} from '../constants/timeTemplatesAndUnits';

export default function calculateMessageTimeAgo(timestamp) {
    const now = dayjs();
    const messageTime = dayjs(timestamp);
    const diffInMinutes = now.diff(messageTime, MINUTE_UNIT);
    const diffInHours = now.diff(messageTime, HOUR_UNIT);

    let timeAgo = '';

    if (diffInMinutes < MINUTES_IN_HOUR_VALUE) {
        timeAgo = __(`${diffInMinutes} мин. назад`, {diffInMinutes});
    } else if (diffInHours < HOURS_IN_DAY_VALUE) {
        timeAgo = __(`${diffInHours} ч. назад`, {diffInHours});
    } else {
        timeAgo = messageTime.format(HOURS_AND_MINUTES_TEMPLATE);
    }

    return timeAgo;
}
