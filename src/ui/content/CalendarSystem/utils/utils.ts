/* eslint-disable no-plusplus */
import dayjs from 'dayjs';
import _omit from 'lodash-es/omit';
import {IDay, IEvent, IEventGroup} from '../CalendarSystem';
import {convertDate} from '../../../../utils/calendar';

const SIX_DAYS_DIFF = 6;
const MAX_DAYS_DIFF_IN_WEEK = 7;
const WEEK_DAY_FORMAT = 'dd, D MMM';

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

export const getSourceCalendarControl = (control: string) => document.querySelector(`[data-sourcecontrol="${control}"]`) as HTMLElement;

export const getFormattedWeekFromDate = (fromDate: Date = null) => {
    const currentWeek = getWeekDaysFromDate(fromDate || new Date());

    return currentWeek.map(dayOfWeek => {
        const copyOfDayWeek = {...dayOfWeek};

        copyOfDayWeek.formattedDisplay = convertDate(dayOfWeek.date, null, WEEK_DAY_FORMAT);
        // eslint-disable-next-line no-unused-expressions
        isDateIsToday(copyOfDayWeek.date) ? copyOfDayWeek.isToday = true : copyOfDayWeek.isToday = false;

        return copyOfDayWeek;
    });
};
