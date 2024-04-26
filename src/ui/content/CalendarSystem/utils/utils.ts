/* eslint-disable no-plusplus */
import dayjs from 'dayjs';
import _omit from 'lodash-es/omit';
import _concat from 'lodash-es/concat';
import _slice from 'lodash-es/slice';
import _upperFirst from 'lodash-es/upperFirst';
import _ceil from 'lodash-es/ceil';
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

export const sortEventsInGroup = (group: IEventGroup) => group.events
    .sort((eventA: IEvent, eventB: IEvent) => {
        const durationAInMinutest = dayjs(eventA.startDate).diff(dayjs(eventA.endDate), 'minutes');

        const durationBInMinutest = dayjs(eventB.startDate).diff(dayjs(eventB.endDate), 'minutes');

        return durationBInMinutest - durationAInMinutest;
    });

export const getSourceCalendarControl = (control: string) => document.querySelector(`[data-icon="control-${control}"]`) as HTMLElement;

export const getFormattedDay = (date: Date = null) => {
    const dateToFormat = date || new Date();

    return {
        dayNumber: dateToFormat.getDate(),
        date: new Date(dateToFormat),
        formattedDisplay: convertDate(dateToFormat, null, WEEK_DAY_FORMAT),
        isToday: isDateIsToday(dateToFormat),
    } as IDay;
};

//TODO использовать существующие функции а не дублировать функционал
export const getFormattedWeekFromDate = (fromDate: Date = null) => {
    const currentWeek = getWeekDaysFromDate(fromDate || new Date());

    return currentWeek.map(dayOfWeek => {
        const copyOfDayWeek = {...dayOfWeek};

        copyOfDayWeek.formattedDisplay = convertDate(dayOfWeek.date, null, WEEK_DAY_FORMAT);
        copyOfDayWeek.isToday = isDateIsToday(copyOfDayWeek.date);

        return copyOfDayWeek;
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

    return _ceil(durationInMinutest / 60, 1);
};

export const formatEventTime = (date: Date) => convertDate(date, null, 'HH:mm');
