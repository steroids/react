import {useMemo} from 'react';
import _head from 'lodash-es/head';
import {IDay} from '../CalendarSystem';
import {getFormattedWeekFromDate, getTwentyFourHoursArray} from '../utils/utils';

const useWeekGrid = (generalCurrentDay: IDay, timeZone?: string) => {
    const currentWeek = useMemo(() => {
        const formattedWeek = getFormattedWeekFromDate(generalCurrentDay.date, timeZone);

        return formattedWeek;
    }, [generalCurrentDay.date, timeZone]);

    return {
        weekGridTwentyFourHoursArray: getTwentyFourHoursArray(),
        weekGridCurrentWeekDays: currentWeek,
    };
};

export default useWeekGrid;
