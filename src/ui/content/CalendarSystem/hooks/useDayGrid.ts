import {IDay} from '../CalendarSystem';
import {getTwentyFourHoursArray} from '../utils/utils';

export const useDayGrid = (
    generalCurrentDay: IDay,
) => ({
    dayGridCurrentDay: generalCurrentDay,
    dayGridTwentyFourHoursArray: getTwentyFourHoursArray(),
});
