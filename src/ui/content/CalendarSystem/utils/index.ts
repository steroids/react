/* eslint-disable no-plusplus */
import dayjs from 'dayjs';
import {IDay} from '../CalendarSystem';

const SIX_DAYS_DIFF = 6;
const DAYS_IN_WEEK = 7;

export const getWeekDaysFromDate = (date: Date) => {
    const weekDays: IDay[] = [];
    const firstDayOfWeek = new Date(date);
    const currentDay = date.getDay();
    const diff = currentDay === 0 ? SIX_DAYS_DIFF : currentDay - 1; // Разница между текущим днем и понедельником

    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - diff); // Устанавливаем первый день недели (понедельник)

    for (let i = 0; i < DAYS_IN_WEEK; i++) {
        const currentDate = new Date(firstDayOfWeek);
        currentDate.setDate(currentDate.getDate() + i);
        weekDays.push({
            dayNumber: currentDate.getDate(),
            date: new Date(currentDate),
        });
    }

    return weekDays;
};

export const isDateIsToday = (date: Date): boolean => dayjs(date).isToday();
