import React from 'react';
import {ICalendarSystemProps} from '../CalendarSystem';
import {getFormattedTodayDate, getTwentyFourHoursArray} from '../utils/utils';

export const useDayGrid = (props: ICalendarSystemProps['dayGrid']) => {
    const [currentDay, setCurrentDay] = React.useState(getFormattedTodayDate());

    return {
        dayGridTwentyFourHoursArray: getTwentyFourHoursArray(),
        dayGridCurrentDay: currentDay,
    };
};
