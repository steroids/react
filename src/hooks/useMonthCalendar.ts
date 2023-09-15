import React from 'react';
import {Day} from 'src/ui/content/CalendarSystem/CalendarSystem';

/* eslint-disable no-plusplus */
export const FIRST_DAY = 1;
const ONE_MONTH = 1;
const TOTAL_DAYS_IN_CALENDAR = 42;

export const useMonthCalendar = () => {
    const [currentMonthDate, setCurrentMonthDate] = React.useState<Date | null>(null);

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return (
            date.getDate() === today.getDate()
            && date.getMonth() === today.getMonth()
            && date.getFullYear() === today.getFullYear()
        );
    };

    const getWeekFromDate = React.useCallback((date: Date) => {
        const weekDays: Day[] = [];
        const firstDayOfWeek = new Date(date);
        const currentDay = date.getDay();
        const diff = currentDay === 0 ? 6 : currentDay - 1; // Разница между текущим днем и понедельником

        firstDayOfWeek.setDate(firstDayOfWeek.getDate() - diff); // Устанавливаем первый день недели (понедельник)

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(firstDayOfWeek);
            currentDate.setDate(currentDate.getDate() + i);
            weekDays.push({
                dayNumber: currentDate.getDate(),
                date: new Date(currentDate),
            });
        }

        return weekDays;
    }, []);

    const getCurrentMonthDataUTC = React.useCallback(() => {
        const currentYear = currentMonthDate?.getFullYear() || new Date().getFullYear();

        const month = currentMonthDate?.getMonth() || new Date().getMonth();
        const nextMonthFirstDay = new Date(currentYear, month + ONE_MONTH, FIRST_DAY);
        const lastDayOfCurrentMonth = new Date(nextMonthFirstDay.getTime() - FIRST_DAY).getDate();
        const firstDayOfCurrentMonth = new Date(Date.UTC(currentYear, month, FIRST_DAY));

        const daysInCurrentMonth = [];

        // Пройдемся по всем дням месяца и добавим их в массив
        for (let dayNumber = 1; dayNumber <= lastDayOfCurrentMonth; dayNumber++) {
            const date = new Date(Date.UTC(currentYear, month, dayNumber));
            daysInCurrentMonth.push({date, dayNumber});
        }

        return {
            currentMonth: month,
            lastDayOfCurrentMonth,
            firstDayOfCurrentMonth,
            daysInCurrentMonth,
        };
    }, [currentMonthDate]);

    const getCalendarArray = React.useCallback(() => {
        const calendarArray: Day[] = [];

        const {firstDayOfCurrentMonth, currentMonth: month, daysInCurrentMonth} = getCurrentMonthDataUTC();

        const firstWeekInMonth = getWeekFromDate(firstDayOfCurrentMonth);

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
            const currentDate = new Date(currentMonthDate?.getFullYear() || new Date().getFullYear(), month + 1, i);

            calendarArray.push({
                date: currentDate,
                dayNumber: currentDate.getDate(),
                outOfRange: currentDate.getMonth() > month,
            });
        }

        return calendarArray.map((day) => isToday(day.date) ? ({
            ...day,
            isToday: true,
        }) : day);
    }, [currentMonthDate, getCurrentMonthDataUTC, getWeekFromDate]);

    return {
        getCalendarArray,
        getCurrentMonthDataUTC,
        getWeekFromDate,
        calendarArray: getCalendarArray(),
        setCurrentMonthDate,
    };
};
