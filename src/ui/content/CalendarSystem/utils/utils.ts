/* eslint-disable no-plusplus */
import dayjs from 'dayjs';
import _omit from 'lodash-es/omit';
import {IDay, IEvent, IEventGroup} from '../CalendarSystem';

const SIX_DAYS_DIFF = 6;
const MAX_DAYS_DIFF_IN_WEEK = 7;

export const getWeekDaysFromDate = (date: Date) => {
    const weekDays: IDay[] = [];
    const firstDayOfWeek = new Date(date);
    const currentDay = date.getDay();
    const diff = currentDay === 0 ? SIX_DAYS_DIFF : currentDay - 1; // Разница между текущим днем и понедельником

    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - diff); // Устанавливаем первый день недели (понедельник)

    for (let i = 0; i < MAX_DAYS_DIFF_IN_WEEK; i++) {
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

export const getOmittedEvent = (event: IEvent | Omit<IEvent, 'color'>) => _omit(event, ['color', 'eventGroupId']);

export const sortEventsInGroup = (group: IEventGroup) => group.events.sort((eventA, eventB) => eventA.date.getTime() - eventB.date.getTime());
