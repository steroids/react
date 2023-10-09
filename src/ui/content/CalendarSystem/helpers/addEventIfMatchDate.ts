/* eslint-disable default-case */
import dayjs from 'dayjs';
import {IEventGroup, IEvent} from '../CalendarSystem';

export const addEventIfMatchDate = (
    eventDateDayJs: dayjs.Dayjs,
    sourceDateInDayJs: dayjs.Dayjs,
    calendarGroup: IEventGroup,
    originalEvent: IEvent,
    unit: 'hours' | 'day',
    selectedEventGroupsIds: number[],
    resultEventsOnDate: IEvent[],
) => {
    if (eventDateDayJs.isSame(sourceDateInDayJs, unit) && selectedEventGroupsIds.includes(calendarGroup.id)) {
        resultEventsOnDate.push({
            ...originalEvent,
            color: originalEvent.color ?? calendarGroup.color,
        });
    }
};
