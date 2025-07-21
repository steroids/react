/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* eslint-disable no-console */
/* eslint-disable default-case */
import {Dispatch, MouseEvent, MutableRefObject, SetStateAction, useCallback} from 'react';

import _get from 'lodash-es/get';
import CalendarEnum from '../enums/CalendarType';
import {getFormattedDay, getSourceCalendarControl} from '../utils/utils';
import DateControlType from '../enums/DateControlType';
import {IDay} from '../CalendarSystem';

const DATASET_CONTROL_TYPE_PATH = 'dataset.control';

const getControlTypeFromButton = (event: MouseEvent<HTMLElement>) => {
    const clickedButton = event.target as HTMLDivElement;

    const controlType: string = _get(clickedButton, DATASET_CONTROL_TYPE_PATH);

    return controlType ?? null;
};

const ONE_DAY = 1;
const ONE_WEEK = 7;
const ONE_MONTH_DIFF = 1;
const ONE_YEAR_DIFF = 1;

const useCalendarControls = (
    calendarType: string,
    generalCurrentDay: IDay,
    setGeneralCurrentDay: Dispatch<SetStateAction<IDay>>,
    isGeneralCurrentDayNeedsUpdate: MutableRefObject<boolean>,
) => {
    const changeMonth = useCallback((isNext = true) => {
        const sourceMonthControl = getSourceCalendarControl(isNext ? DateControlType.NEXT_ONE : DateControlType.PREV_ONE);

        sourceMonthControl.click();
    }, []);

    const checkIsOutAndUpdateInnerCalendar = useCallback((formattedDay: IDay, prevMonthNumber: number, prevYearNumber: number) => {
        //Если при нажатии на кнопку произошел переход на следующий или предыдущий месяц или год
        const isDateOutOfMonth = formattedDay.date.getMonth() !== prevMonthNumber;
        const isDateOutOfYear = formattedDay.date.getFullYear() !== prevYearNumber;

        if (isDateOutOfMonth || isDateOutOfYear) {
            isGeneralCurrentDayNeedsUpdate.current = false;

            if (
                (formattedDay.date.getMonth() - prevMonthNumber === ONE_MONTH_DIFF)
                || (formattedDay.date.getFullYear() - prevYearNumber === ONE_YEAR_DIFF)
            ) {
                changeMonth();
                return;
            } else if (
                (prevMonthNumber - formattedDay.date.getMonth() === ONE_MONTH_DIFF)
                || (prevYearNumber - formattedDay.date.getFullYear() === ONE_YEAR_DIFF)
            ) {
                changeMonth(false);
                return;
            }
        }
    }, [changeMonth, isGeneralCurrentDayNeedsUpdate]);

    const changeDay = useCallback((isNext = true) => {
        const prevMonthNumber = generalCurrentDay.date.getMonth();
        const prevYearNumber = generalCurrentDay.date.getFullYear();

        const dayTimestamp = new Date(generalCurrentDay.date)
            .setDate(isNext ? generalCurrentDay.date.getDate() + ONE_DAY : generalCurrentDay.date.getDate() - ONE_DAY);

        const formattedDay = getFormattedDay(new Date(dayTimestamp));

        setGeneralCurrentDay(formattedDay);

        checkIsOutAndUpdateInnerCalendar(formattedDay, prevMonthNumber, prevYearNumber);
    }, [checkIsOutAndUpdateInnerCalendar, generalCurrentDay.date, setGeneralCurrentDay]);

    const changeWeek = useCallback((isNext = true) => {
        const prevMonthNumber = generalCurrentDay.date.getMonth();
        const prevYearNumber = generalCurrentDay.date.getFullYear();

        const dayTimestamp = new Date(generalCurrentDay.date)
            .setDate(isNext ? generalCurrentDay.date.getDate() + ONE_WEEK : generalCurrentDay.date.getDate() - ONE_WEEK);

        const formattedDay = getFormattedDay(new Date(dayTimestamp));

        setGeneralCurrentDay(formattedDay);

        checkIsOutAndUpdateInnerCalendar(formattedDay, prevMonthNumber, prevYearNumber);
    }, [generalCurrentDay.date, setGeneralCurrentDay, checkIsOutAndUpdateInnerCalendar]);

    const onClickControl = useCallback((event: MouseEvent<HTMLElement>) => {
        const controlType = getControlTypeFromButton(event);
        const sourceCalendarControl = getSourceCalendarControl(controlType);

        if (!sourceCalendarControl) {
            return;
        }

        switch (calendarType) {
            case CalendarEnum.MONTH: {
                sourceCalendarControl.click();
                break;
            }
            case CalendarEnum.WEEK: {
                switch (controlType) {
                    case DateControlType.NEXT_DOUBLE: {
                        isGeneralCurrentDayNeedsUpdate.current = true;
                        changeMonth();
                        return;
                    }
                    case DateControlType.NEXT_ONE: {
                        changeWeek();
                        return;
                    }
                    case DateControlType.PREV_ONE: {
                        changeWeek(false);
                        return;
                    }
                    case DateControlType.PREV_DOUBLE: {
                        isGeneralCurrentDayNeedsUpdate.current = true;
                        changeMonth(false);
                    }
                }
                break;
            }
            case CalendarEnum.DAY: {
                switch (controlType) {
                    case DateControlType.NEXT_DOUBLE: {
                        changeWeek();
                        return;
                    }
                    case DateControlType.NEXT_ONE: {
                        changeDay();
                        return;
                    }
                    case DateControlType.PREV_ONE: {
                        changeDay(false);
                        return;
                    }
                    case DateControlType.PREV_DOUBLE: {
                        changeWeek(false);
                    }
                }
            }
        }
    }, [calendarType, changeDay, changeMonth, changeWeek, isGeneralCurrentDayNeedsUpdate]);

    return {onClickControl};
};

export default useCalendarControls;
