import React from 'react';
import {IDay} from '../CalendarSystem';
import {convertDate} from '../../../../utils/calendar';
import DateControlEnum from '../../../../enums/DateControlType';
import {getCalendarControl} from './useCalendarControls';
import {getWeekDaysFromDate, isDateIsToday} from '../utils';

const WEEK_DAY_FORMAT = 'dd, D MMM';

const ONE_DAY = 1;

const getFormattedWeekFromDate = (fromDate: Date = null) => {
    const currentWeek = getWeekDaysFromDate(fromDate || new Date());

    return currentWeek.map(dayOfWeek => {
        const copyOfDayWeek = {...dayOfWeek};

        copyOfDayWeek.formattedDisplay = convertDate(dayOfWeek.date, null, WEEK_DAY_FORMAT);
        // eslint-disable-next-line no-unused-expressions
        isDateIsToday(copyOfDayWeek.date) ? copyOfDayWeek.isToday = true : copyOfDayWeek.isToday = false;

        return copyOfDayWeek;
    });
};

const useWeekCalendar = (currentMonthDate: Date) => {
    const [currentWeek, setCurrentWeek] = React.useState(getFormattedWeekFromDate());

    const forceUpdateWeekOnMonthChange = React.useCallback((newMonthDate: Date) => {
        setCurrentWeek(getFormattedWeekFromDate(newMonthDate));
    }, []);

    const changeMonthAfterWeekChanged = React.useCallback((formattedWeek: IDay[]) => {
        const firstDayOfWeek = formattedWeek[0].date;
        const currentMonthNumber = currentMonthDate.getMonth();

        const isWeekOutOfMonth = formattedWeek.every(dayOfWeek => dayOfWeek.date.getMonth() !== currentMonthNumber);

        if (!isWeekOutOfMonth) {
            return;
        }

        if (currentMonthNumber - firstDayOfWeek.getMonth() === 1) {
            const lastDayOfWeekInNewMonth = formattedWeek[formattedWeek.length - 1].date;

            const prevMonthControl = getCalendarControl(DateControlEnum.PREV_ONE);
            prevMonthControl.click();
            forceUpdateWeekOnMonthChange(lastDayOfWeekInNewMonth);
        } else {
            const firstDayOfWeekInNewMonth = formattedWeek[0].date;

            const nextMonthControl = getCalendarControl(DateControlEnum.NEXT_ONE);
            nextMonthControl.click();
            forceUpdateWeekOnMonthChange(firstDayOfWeekInNewMonth);
        }
    }, [currentMonthDate, forceUpdateWeekOnMonthChange]);

    const setNextWeek = React.useCallback(() => {
        const lastDayOfWeek = currentWeek[currentWeek.length - 1].date;
        lastDayOfWeek.setDate(lastDayOfWeek.getDate() + ONE_DAY);

        const formattedNextWeek = getFormattedWeekFromDate(lastDayOfWeek);

        setCurrentWeek(formattedNextWeek);
        changeMonthAfterWeekChanged(formattedNextWeek);
    }, [currentWeek, changeMonthAfterWeekChanged]);

    const setPrevWeek = React.useCallback(() => {
        const firstDayOfWeek = currentWeek[0].date;
        firstDayOfWeek.setDate(firstDayOfWeek.getDate() - ONE_DAY);

        const formattedPrevWeek = getFormattedWeekFromDate(firstDayOfWeek);

        setCurrentWeek(formattedPrevWeek);
        changeMonthAfterWeekChanged(formattedPrevWeek);
    }, [currentWeek, changeMonthAfterWeekChanged]);

    return {
        currentWeek,
        weekControls: {
            [DateControlEnum.NEXT_DOUBLE]: null,
            [DateControlEnum.NEXT_ONE]: setNextWeek,
            [DateControlEnum.PREV_ONE]: setPrevWeek,
            [DateControlEnum.PREV_DOUBLE]: null,
        },
        forceUpdateWeekOnMonthChange,
    };
};

export default useWeekCalendar;
