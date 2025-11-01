/* eslint-disable no-plusplus */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import _omit from 'lodash-es/omit';
import _concat from 'lodash-es/concat';
import _slice from 'lodash-es/slice';
import _upperFirst from 'lodash-es/upperFirst';
import _ceil from 'lodash-es/ceil';
import {CSSProperties} from 'react';
import {IDay, IEvent, IEventGroup} from '../CalendarSystem';
import {convertDate} from '../../../../utils/calendar';

dayjs.extend(utc);
dayjs.extend(timezone);

// Возвращает дату, смещённую относительно указанного часового пояса.
export const getDateInTimeZone = (date: Date, timeZone?: string): dayjs.Dayjs => timeZone
    ? dayjs(date).tz(timeZone).startOf('day') : dayjs(date).startOf('day');

// Проверяет, является ли данная дата сегодняшним днём в указанном часовом поясе.
export const isTodayInTimeZone = (date: Date, timeZone?: string): boolean => {
    if (!timeZone) { return dayjs(date).isToday(); }
    const now = dayjs().tz(timeZone).startOf('day');
    const target = dayjs(date).tz(timeZone).startOf('day');

    return now.isSame(target, 'day');
};

// Костыль для показа текущего дня в виде месяц
export const isTodayInMonthGrid = (date: number, currentMonth: number, timeZone?: string): boolean => {
    const now = timeZone
        ? dayjs().tz(timeZone)
        : dayjs();
    return date === now.date() && now.month() === currentMonth;
};

export const getWeekDaysFromDate = (date: Date) => {
    const base = dayjs(date).utc();
    const dow = base.day() === 0 ? 6 : base.day() - 1;

    return Array.from({length: 7}, (_, i) => {
        const d = base.subtract(dow, 'day').add(i, 'day');
        return {
            dayNumber: d.date(),
            date: d.toDate(),
        };
    });
};

export const getOmittedEvent = (event: IEvent | Omit<IEvent, 'color'>) => _omit(event, ['color', 'eventGroupId']);

export const sortEventsInGroup = (group: IEventGroup) => group.events
    .sort((eventA: IEvent, eventB: IEvent) => {
        const durationAInMinutest = dayjs(eventA.startDate).diff(dayjs(eventA.endDate), 'minutes');

        const durationBInMinutest = dayjs(eventB.startDate).diff(dayjs(eventB.endDate), 'minutes');

        return durationBInMinutest - durationAInMinutest;
    });

export const getSourceCalendarControl = (control: string) => document.querySelector(`[data-icon="control-${control}"]`) as HTMLElement;

export const getFormattedDay = (date: Date | null, timeZone?: string): IDay => {
    const base = date ? dayjs(date) : dayjs();
    const zoned = getDateInTimeZone(base.toDate(), timeZone);

    return {
        dayNumber: zoned.date(),
        date: zoned.toDate(),
        formattedDisplay: zoned.format('ddd, D MMM'),
        isToday: isTodayInTimeZone(base.toDate(), timeZone),
    };
};

export const getFormattedWeekFromDate = (fromDate: Date = null, timeZone?: string) => {
    const week = getWeekDaysFromDate(fromDate || new Date());

    return week.map(day => {
        const zoned = getDateInTimeZone(day.date, timeZone);

        return {
            ...day,
            formattedDisplay: zoned.format('ddd DD MMM'),
            isToday: isTodayInTimeZone(day.date, timeZone),
        };
    });
};

export const getTwentyFourHoursArray = () => {
    const hoursArray: string[] = [];
    for (let i = 0; i < 24; i++) {
        const formattedHour = dayjs().startOf('day').add(i, 'hour').format('HH:00');
        hoursArray.push(formattedHour);
    }
    return hoursArray;
};

export const getWeekDays = () => {
    const unformattedDaysOfWeek = dayjs.weekdaysMin();

    return _concat(_slice(unformattedDaysOfWeek, 1), unformattedDaysOfWeek[0]).map(weekDay => __(`${_upperFirst(weekDay)}`));
};

export const getProportionFromEvent = (event: IEvent) => {
    const startDate = dayjs(event.startDate);
    const endDate = dayjs(event.endDate);

    const durationInMinutest = endDate.diff(startDate, 'minutes');

    return 100 * _ceil(durationInMinutest / 60, 1);
};

export const getTopMarginFromEvent = (event: IEvent) => {
    const startDate = dayjs(event.startDate);

    const startDateHour = startDate.set('minutes', 0);

    const durationInMinutest = startDate.diff(startDateHour, 'minutes');

    const topMargin = _ceil(durationInMinutest / 60, 1) * 100;

    return {
        top: `${topMargin}%`,
    } as CSSProperties;
};

export const formatEventTime = (date: Date) => convertDate(date, null, 'HH:mm');
