/* eslint-disable no-plusplus */
import React from 'react';
import dayjs from 'dayjs';
import {IDay} from '../CalendarSystem';
import DateControlEnum from '../enums/DateControlType';
import {getFormattedWeekFromDate, getSourceCalendarControl} from '../utils/utils';

const ONE_DAY = 1;

const useWeekGrid = (currentMonthFirstDayDate: Date) => {
    const [currentWeek, setCurrentWeek] = React.useState(getFormattedWeekFromDate());

    const updateWeekOnMonthChange = React.useCallback((newMonthDate: Date) => {
        setCurrentWeek(getFormattedWeekFromDate(newMonthDate));
    }, []);

    const changeMonthAfterWeekChanged = React.useCallback((formattedWeek: IDay[]) => {
        const firstDayOfWeek = formattedWeek[0].date;
        const currentMonthNumber = currentMonthFirstDayDate.getMonth();

        const isWeekOutOfMonth = formattedWeek.every(dayOfWeek => dayOfWeek.date.getMonth() !== currentMonthNumber);

        if (!isWeekOutOfMonth) {
            return;
        }

        if (currentMonthNumber - firstDayOfWeek.getMonth() === 1) {
            const lastDayOfWeekInNewMonth = formattedWeek[formattedWeek.length - 1].date;

            const prevMonthControl = getSourceCalendarControl(DateControlEnum.PREV_ONE);
            prevMonthControl.click();
            updateWeekOnMonthChange(lastDayOfWeekInNewMonth);
        } else {
            const firstDayOfWeekInNewMonth = formattedWeek[0].date;

            const nextMonthControl = getSourceCalendarControl(DateControlEnum.NEXT_ONE);
            nextMonthControl.click();
            updateWeekOnMonthChange(firstDayOfWeekInNewMonth);
        }
    }, [currentMonthFirstDayDate, updateWeekOnMonthChange]);

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

    const twentyFourHoursArray = React.useMemo(() => {
        const hoursArray = [];
        for (let i = 0; i < 24; i++) {
            const formattedHour = dayjs().startOf('day').add(i, 'hour').format('HH:00');
            hoursArray.push(formattedHour);
        }
        return hoursArray;
    }, []);

    return {
        weekGrid24HoursArray: twentyFourHoursArray,
        weekGridCurrentWeekDays: currentWeek,
        weekGridControls: {
            [DateControlEnum.NEXT_DOUBLE]: DateControlEnum.NEXT_ONE,
            [DateControlEnum.NEXT_ONE]: setNextWeek,
            [DateControlEnum.PREV_ONE]: setPrevWeek,
            [DateControlEnum.PREV_DOUBLE]: DateControlEnum.PREV_ONE,
        } as {[key: string]: () => void | DateControlEnum},
        updateWeekOnMonthChange,
    };
};

export default useWeekGrid;
