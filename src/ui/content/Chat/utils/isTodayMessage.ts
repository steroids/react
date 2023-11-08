import dayjs from 'dayjs';

export const isTodayMessage = (timestamp: string | Date) => {
    const messageDate = dayjs(timestamp);

    const currentDate = dayjs();

    return currentDate.isSame(messageDate, 'day') || currentDate.isAfter(messageDate);
};
