/* eslint-disable no-plusplus */
/* eslint-disable import/order */
import {useMemo} from 'react';
import {IDay} from '../CalendarSystem';
import {getDateInTimeZone, getWeekDays, getWeekDaysFromDate, isTodayInTimeZone} from '../utils/utils';
import _upperFirst from 'lodash-es/upperFirst';

const FIRST_DAY = 1;
const ONE_MONTH = 1;
const TOTAL_DAYS_IN_CALENDAR = 42;

const useMonthGrid = (generalCurrentDay: IDay, timeZone?: string) => {
    const currentMonthData = useMemo(() => {
        const currentYear = generalCurrentDay.date?.getFullYear();

        const month = generalCurrentDay.date?.getMonth();
        const nextMonthFirstDay = new Date(currentYear, month + ONE_MONTH, FIRST_DAY);
        const lastDateOfCurrentMonth = new Date(nextMonthFirstDay.getTime() - FIRST_DAY).getDate();
        const firstDateOfCurrentMonth = new Date(Date.UTC(currentYear, month, FIRST_DAY));

        const daysInCurrentMonth = [];

        // Пройдемся по всем дням месяца и добавим их в массив
        for (let dayNumber = 1; dayNumber <= lastDateOfCurrentMonth; dayNumber++) {
            const date = new Date(Date.UTC(currentYear, month, dayNumber));
            daysInCurrentMonth.push({
                date,
                dayNumber,
            });
        }

        return {
            currentMonth: month,
            lastDateOfCurrentMonth,
            firstDateOfCurrentMonth,
            daysInCurrentMonth,
        };
    }, [generalCurrentDay.date]);

    const calendarArray = useMemo(() => {
        const innerCalendarArray: IDay[] = [];

        const {firstDateOfCurrentMonth, currentMonth, daysInCurrentMonth} = currentMonthData;

        const firstWeekInMonth = getWeekDaysFromDate(firstDateOfCurrentMonth);

        firstWeekInMonth.forEach((day) => innerCalendarArray.push({
            date: day.date,
            dayNumber: day.dayNumber,
            outOfRange: day.date.getMonth() < currentMonth,
        }));

        daysInCurrentMonth.forEach((day) => {
            const existingDay = innerCalendarArray.find((item) => item.date.getTime() === day.date.getTime());
            if (!existingDay) {
                innerCalendarArray.push({
                    date: day.date,
                    dayNumber: day.dayNumber,
                    outOfRange: false,
                });
            }
        });

        const daysAfterCurrentMonth = TOTAL_DAYS_IN_CALENDAR - innerCalendarArray.length;

        for (let i = 1; i <= daysAfterCurrentMonth; i++) {
            const currentDate = new Date(generalCurrentDay.date.getFullYear(), currentMonth + 1, i);

            innerCalendarArray.push({
                date: currentDate,
                dayNumber: currentDate.getDate(),
                outOfRange: currentDate.getMonth() > currentMonth,
            });
        }

        return innerCalendarArray.map((day) => {
            const zoned = getDateInTimeZone(day.date, timeZone);
            return isTodayInTimeZone(zoned, timeZone)
                ? {...day,
                    date: zoned,
                    isToday: true}
                : {...day,
                    date: zoned};
        });
    }, [generalCurrentDay.date, currentMonthData, timeZone]);

    return {
        monthGridWeekDays: getWeekDays(),
        monthGridCalendarDays: calendarArray,
    };
};

export default useMonthGrid;
