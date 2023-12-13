/* eslint-disable default-case */
import React from 'react';
import dayjs from 'dayjs';
import {IEvent, IEventGroup} from '../CalendarSystem';
import CalendarEnum from '../enums/CalendarType';
import {addEventIfMatchDate} from '../helpers/addEventIfMatchDate';

const CALENDAR_TYPE_GETTING_EVENTS_PROPERTIES = {
    [CalendarEnum.MONTH]: {
        getDayJsDate: (date: Date) => dayjs(date),
        unit: 'day',
    },
    [CalendarEnum.WEEK]: {
        getDayJsDate: (date: Date) => {
            const eventDate = new Date(date);
            eventDate.setHours(eventDate.getHours(), 0, 0, 0);

            return dayjs(eventDate);
        },
        unit: 'hours',
    },
};

export const useEventsFromDate = (innerEventGroups: IEventGroup[], selectedEventGroupsIds: number[]) => {
    const getEventsFromDate = React.useCallback((dateFromDay: Date, currentCalendarType: CalendarEnum) => {
        const resultEventsOnDate: IEvent[] = [];
        const dayjsDateFromDay = dayjs(dateFromDay);

        const forEachEventGroupEvent = (callback: (event: IEvent, eventGroup: IEventGroup) => void) => {
            innerEventGroups.forEach(eventGroup => {
                eventGroup.events.forEach(event => {
                    callback(event as IEvent, eventGroup);
                });
            });
        };

        const calendarTypeProperties = CALENDAR_TYPE_GETTING_EVENTS_PROPERTIES[currentCalendarType as string];

        forEachEventGroupEvent((event, eventGroup) => {
            const eventDateDayJs = calendarTypeProperties.getDayJsDate(event.date);

            addEventIfMatchDate(
                eventDateDayJs,
                dayjsDateFromDay,
                eventGroup,
                event,
                calendarTypeProperties.unit as 'hours' | 'day',
                selectedEventGroupsIds,
                resultEventsOnDate,
            );
        });

        return resultEventsOnDate;
    }, [innerEventGroups, selectedEventGroupsIds]);

    return {
        getEventsFromDate,
    };
};
