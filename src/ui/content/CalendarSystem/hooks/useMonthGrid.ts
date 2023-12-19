/* eslint-disable no-plusplus */
/* eslint-disable import/order */
import React from 'react';
import {IDay} from '../CalendarSystem';
import {getWeekDaysFromDate, isDateIsToday} from '../utils/utils';
import _concat from 'lodash-es/concat';
import _slice from 'lodash-es/slice';
import dayjs from 'dayjs';
import _upperFirst from 'lodash-es/upperFirst';

const FIRST_DAY = 1;
const ONE_MONTH = 1;
const TOTAL_DAYS_IN_CALENDAR = 42;

const useMonthGrid = (currentMonthFirstDayDate: Date, setCurrentMonthFirstDayDate: React.Dispatch<React.SetStateAction<Date>>) => {
    const getCurrentMonthDataUTC = React.useCallback(() => {
        const currentYear = currentMonthFirstDayDate?.getFullYear() || new Date().getFullYear();

        const month = currentMonthFirstDayDate?.getMonth() || new Date().getMonth();
        const nextMonthFirstDay = new Date(currentYear, month + ONE_MONTH, FIRST_DAY);
        const lastDayOfCurrentMonth = new Date(nextMonthFirstDay.getTime() - FIRST_DAY).getDate();
        const firstDayOfCurrentMonth = new Date(Date.UTC(currentYear, month, FIRST_DAY));

        if (currentMonthFirstDayDate === null) {
            setCurrentMonthFirstDayDate(firstDayOfCurrentMonth);
        }

        const daysInCurrentMonth = [];

        // Пройдемся по всем дням месяца и добавим их в массив
        for (let dayNumber = 1; dayNumber <= lastDayOfCurrentMonth; dayNumber++) {
            const date = new Date(Date.UTC(currentYear, month, dayNumber));
            daysInCurrentMonth.push({date,
dayNumber});
        }

        return {
            currentMonth: month,
            lastDayOfCurrentMonth,
            firstDayOfCurrentMonth,
            daysInCurrentMonth,
        };
    }, [currentMonthFirstDayDate, setCurrentMonthFirstDayDate]);

    const getCalendarArray = React.useCallback(() => {
        const calendarArray: IDay[] = [];

        const {firstDayOfCurrentMonth, currentMonth: month, daysInCurrentMonth} = getCurrentMonthDataUTC();

        const firstWeekInMonth = getWeekDaysFromDate(firstDayOfCurrentMonth);

        firstWeekInMonth.forEach((day) => calendarArray.push({
            date: day.date,
            dayNumber: day.dayNumber,
            outOfRange: day.date.getMonth() < month,
        }));

        daysInCurrentMonth.forEach((day) => {
            const existingDay = calendarArray.find((item) => item.date.getTime() === day.date.getTime());
            if (!existingDay) {
                calendarArray.push({
                    date: day.date,
                    dayNumber: day.dayNumber,
                    outOfRange: false,
                });
            }
        });

        const daysAfterCurrentMonth = TOTAL_DAYS_IN_CALENDAR - calendarArray.length;

        for (let i = 1; i <= daysAfterCurrentMonth; i++) {
            const currentDate = new Date(currentMonthFirstDayDate?.getFullYear(), month + 1, i);

            calendarArray.push({
                date: currentDate,
                dayNumber: currentDate.getDate(),
                outOfRange: currentDate.getMonth() > month,
            });
        }

        return calendarArray.map((day) => isDateIsToday(day.date) ? ({
            ...day,
            isToday: true,
        }) : day);
    }, [currentMonthFirstDayDate, getCurrentMonthDataUTC]);

    const weekDays = React.useMemo(() => {
        const unformattedDaysOfWeek = dayjs.weekdaysMin();

        return _concat(_slice(unformattedDaysOfWeek, 1), unformattedDaysOfWeek[0]).map(weekDay => __(`${_upperFirst(weekDay)}`));
    }, []);

    return {
        monthGridWeekDays: weekDays,
        monthGridCalendarDays: getCalendarArray(),
        getCalendarArray,
        getCurrentMonthDataUTC,
        getWeekFromDate: getWeekDaysFromDate,
    };
};

export default useMonthGrid;
