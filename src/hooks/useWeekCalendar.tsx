import React from 'react';
import {Day} from '../ui/content/CalendarSystem/CalendarSystem';
import {convertDate} from '../utils/calendar';
import {getWeekFromDate, isToday} from './useMonthCalendar';
import DateControlEnum from '../enums/DateControlType';
import {getCalendarControl} from './useCalendarControls';

const WEEK_DAY_FORMAT = 'dd, D MMM';

const ONE_DAY = 1;

const getFormattedWeekFromDate = (fromDate: Date = null) => {
    const currentWeek = getWeekFromDate(fromDate || new Date());

    return currentWeek.map(dayOfWeek => {
        const copyOfDayWeek = {...dayOfWeek};

        copyOfDayWeek.formattedDisplay = convertDate(dayOfWeek.date, null, WEEK_DAY_FORMAT);
        // eslint-disable-next-line no-unused-expressions
        isToday(copyOfDayWeek.date) ? copyOfDayWeek.isToday = true : copyOfDayWeek.isToday = false;

        return copyOfDayWeek;
    });
};

const useWeekCalendar = (currentMonthDate: Date) => {
    const [currentWeek, setCurrentWeek] = React.useState(getFormattedWeekFromDate());

    const forceUpdateWeekOnMonthChange = React.useCallback((newMonthDate: Date) => {
        setCurrentWeek(getFormattedWeekFromDate(newMonthDate));
    }, []);

    const updateEffect = React.useCallback((formattedWeek: Day[]) => {
        const firstDayOfWeek = formattedWeek[0].date;
        const currentMonthNumber = currentMonthDate.getMonth();

        const isWeekOutOfMonth = formattedWeek.every(dayOfWeek => dayOfWeek.date.getMonth() !== currentMonthNumber);

        if (!isWeekOutOfMonth) {
            return;
        }

        if (currentMonthNumber - firstDayOfWeek.getMonth() === 1) {
            const lastDayOfWeekInNewMonth = formattedWeek[formattedWeek.length - 1].date;

            const prevMonthControl = getCalendarControl(DateControlEnum.PrevOne);
            prevMonthControl.click();
            forceUpdateWeekOnMonthChange(lastDayOfWeekInNewMonth);
        } else {
            const firstDayOfWeekInNewMonth = formattedWeek[0].date;

            const nextMonthControl = getCalendarControl(DateControlEnum.NextOne);
            nextMonthControl.click();
            forceUpdateWeekOnMonthChange(firstDayOfWeekInNewMonth);
        }
    }, [currentMonthDate, forceUpdateWeekOnMonthChange]);

    const setNextWeek = React.useCallback(() => {
        const lastDayOfWeek = currentWeek[currentWeek.length - 1].date;
        lastDayOfWeek.setDate(lastDayOfWeek.getDate() + ONE_DAY);

        const formattedNextWeek = getFormattedWeekFromDate(lastDayOfWeek);

        setCurrentWeek(formattedNextWeek);
        updateEffect(formattedNextWeek);
    }, [currentWeek, updateEffect]);

    const setPrevWeek = React.useCallback(() => {
        const firstDayOfWeek = currentWeek[0].date;
        firstDayOfWeek.setDate(firstDayOfWeek.getDate() - ONE_DAY);

        const formattedPrevWeek = getFormattedWeekFromDate(firstDayOfWeek);

        setCurrentWeek(formattedPrevWeek);
        updateEffect(formattedPrevWeek);
    }, [currentWeek, updateEffect]);

    return {
        currentWeek,
        weekControls: {
            [DateControlEnum.NextDouble]: null,
            [DateControlEnum.NextOne]: setNextWeek,
            [DateControlEnum.PrevOne]: setPrevWeek,
            [DateControlEnum.PrevDouble]: null,
        },
        forceUpdateWeekOnMonthChange,
    };
};

export default useWeekCalendar;
