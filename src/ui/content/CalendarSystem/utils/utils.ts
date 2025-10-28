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

const SIX_DAYS_DIFF = 6;
const MAX_DAYS_DIFF_IN_WEEK = 7;
const WEEK_DAY_FORMAT = 'dd, D MMM';

/**
 * Возвращает дату, смещённую относительно указанной временной зоны.
 */
export const getDateInTimeZone = (date: Date, timeZone?: string): Date => {
    if (!timeZone) { return date; }
    const zoned = dayjs.utc(date).tz(timeZone, true); // true => сохраняет локальное время
    return zoned.toDate();
};

/**
 * Проверяет, является ли данная дата сегодняшним днём в указанной временной зоне.
 */
export const isTodayInTimeZone = (date: Date, timeZone?: string): boolean => {
    if (!timeZone) { return dayjs(date).isToday(); }

    // Берём "сейчас" и "цель" обе в одной таймзоне
    const now = dayjs().tz(timeZone);
    const target = dayjs.utc(date).tz(timeZone);
    console.log(now.date());
    console.log(target.date());
    console.log(now.isSame(target, 'day')); // <-- ключевой момент: utc()

    return now.isSame(target, 'day');
};

export const getWeekDaysFromDate = (date: Date, timeZone?: string) => {
    const weekDays: IDay[] = [];
    const firstDayOfWeek = new Date(date);
    const currentDay = date.getDay();
    const diff = currentDay === 0 ? 6 : currentDay - 1;

    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - diff);

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(firstDayOfWeek);
        currentDate.setDate(firstDayOfWeek.getDate() + i);

        const zonedDate = getDateInTimeZone(currentDate, timeZone);

        weekDays.push({
            dayNumber: zonedDate.getDate(),
            date: zonedDate,
        });
    }

    return weekDays;
};

export const isDateIsToday = (date: Date): boolean => dayjs(date).isToday();

export const getOmittedEvent = (event: IEvent | Omit<IEvent, 'color'>) => _omit(event, ['color', 'eventGroupId']);

export const sortEventsInGroup = (group: IEventGroup) => group.events
    .sort((eventA: IEvent, eventB: IEvent) => {
        const durationAInMinutest = dayjs(eventA.startDate).diff(dayjs(eventA.endDate), 'minutes');

        const durationBInMinutest = dayjs(eventB.startDate).diff(dayjs(eventB.endDate), 'minutes');

        return durationBInMinutest - durationAInMinutest;
    });

export const getSourceCalendarControl = (control: string) => document.querySelector(`[data-icon="control-${control}"]`) as HTMLElement;

export const getFormattedDay = (date: Date = null, timeZone?: string) => {
    const baseDate = date || new Date();
    const zonedDate = getDateInTimeZone(baseDate, timeZone);

    return {
        dayNumber: zonedDate.getDate(),
        date: zonedDate,
        formattedDisplay: convertDate(zonedDate, null, WEEK_DAY_FORMAT),
        isToday: isTodayInTimeZone(zonedDate, timeZone),
    } as IDay;
};

//TODO использовать существующие функции а не дублировать функционал
export const getFormattedWeekFromDate = (fromDate: Date = null, timeZone?: string) => {
    const currentWeek = getWeekDaysFromDate(fromDate || new Date());

    return currentWeek.map(dayOfWeek => {
        const zonedDate = getDateInTimeZone(dayOfWeek.date, timeZone);
        return {
            ...dayOfWeek,
            date: zonedDate,
            formattedDisplay: convertDate(zonedDate, null, WEEK_DAY_FORMAT),
            isToday: isTodayInTimeZone(zonedDate, timeZone),
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
