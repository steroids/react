import _head from 'lodash-es/head';
import {useMemo} from 'react';

import {IDay} from '../CalendarSystem';
import {getFormattedWeekFromDate, getTwentyFourHoursArray} from '../utils/utils';

const useWeekGrid = (generalCurrentDay: IDay) => {
    const currentWeek = useMemo(() => {
        const formattedWeek = getFormattedWeekFromDate(generalCurrentDay.date);

        return formattedWeek;
    }, [generalCurrentDay.date]);

    return {
        weekGridTwentyFourHoursArray: getTwentyFourHoursArray(),
        weekGridCurrentWeekDays: currentWeek,
    };
};

export default useWeekGrid;
