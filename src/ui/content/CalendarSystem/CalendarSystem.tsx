/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
import React from 'react';
import __upperFirst from 'lodash-es/upperFirst';
import dayjs from 'dayjs';
import _concat from 'lodash-es/concat';
import _slice from 'lodash-es/slice';
import localeData from 'dayjs/plugin/localeData';
import {IModalProps} from '../../../ui/modal/Modal/Modal';
import {openModal} from '../../../actions/modal';
import useCalendarControls from './hooks/useCalendarControls';
import useDisplayDate from './hooks/useDisplayDate';
import useMonthCalendar from './hooks/useMonthCalendar';
import {useComponents, useDispatch, useWeekCalendar} from '../../../hooks';
import CalendarEnum from '../../../enums/CalendarType';

dayjs.extend(localeData);

export const DAYS_OF_WEEK = (() => {
    const unformattedDaysOfWeek = dayjs.weekdaysMin();

    return _concat(_slice(unformattedDaysOfWeek, 1), unformattedDaysOfWeek[0]);
})();

export const HOURS = (() => {
    const hoursArray = [];
    for (let i = 0; i < 24; i++) {
        const formattedHour = dayjs().startOf('day').add(i, 'hour').format('HH:00');
        hoursArray.push(formattedHour);
    }
    return hoursArray;
})();

export interface IDay {
    dayNumber: number;
    date: Date;
    outOfRange?: boolean;
    isToday?: boolean;
    formattedDisplay?: string,
}

export interface IPresentDateInfo {
    currentYear: number;
    currentMonth: number;
    dateToDisplay: string;
}
export interface IEvent {
    date: Date,
    title: string,
    color?: string,
    [key: string]: any,
}

export interface ICalendarGroups {
    id: number,
    label: string,
    color?: string,
    events: IEvent[],
}

export interface ICalendarSystemProps extends IUiComponent {
    onCreateEvent?: () => void;
    onChangeType?: (newType: string) => void;
    createEventModalProps: IModalProps,
    calendarGroups: {
        title: string,
        items: ICalendarGroups[],
    },
    [key: string]: any;
}

export interface ICalendarSystemViewProps extends Omit<ICalendarSystemProps, 'calendarGroups'> {
    monthCalendarDays: IDay[],
    currentWeekDays: IDay[],
    calendarType: CalendarEnum,
    dateToDisplay: string,
    calendarGroups: ICalendarGroups[],
    calendarGroupsTitle: string,
    selectedCalendarGroupsIds: number[],
    onChangeType: (newType: 'Month' | 'Week') => void,
    onMonthChange: (newDate: Date) => void,
    onClickControls: (event: React.MouseEvent<HTMLElement>) => void
    onClickCreate: VoidFunction,
    getEventsFromDate: (dateFromDay: Date, isMonth: boolean) => IEvent[],
    onChangeCalendarGroupsIds: (selectedIds: number[]) => void,
}

export type ICalendarSystemModalViewProps = IModalProps

export default function CalendarSystem(props: ICalendarSystemProps) {
    const components = useComponents();
    const dispatch = useDispatch();
    const [innerCalendarGroups, setInnerCalendarGroups] = React.useState<ICalendarGroups[]>(props.calendarGroups.items || []);
    const [selectedCalendarGroupsIds, setSelectedCalendarGroupsIds] = React.useState<number[]>([]);
    const {dateToDisplay, setNewDateToDisplay} = useDisplayDate();
    const [calendarType, setCalendarType] = React.useState<CalendarEnum>(CalendarEnum.MONTH);
    const {calendarArray: monthCalendarDays, setCurrentMonthDate, currentMonthDate} = useMonthCalendar();

    const {
        currentWeek: currentWeekDays,
        weekControls,
        forceUpdateWeekOnMonthChange,
    } = useWeekCalendar(
        currentMonthDate,
    );

    const {onClickControls} = useCalendarControls(calendarType, weekControls);

    const onChangeType = React.useCallback((newType: 'Month' | 'Week') => {
        setCalendarType(newType);

        if (props.onChangeType) {
            props.onChangeType(newType);
        }
    }, [props]);

    const onMonthChange = React.useCallback((newDate: Date) => {
        setNewDateToDisplay(newDate);
        setCurrentMonthDate(newDate);
        forceUpdateWeekOnMonthChange(newDate);
    }, [forceUpdateWeekOnMonthChange, setCurrentMonthDate, setNewDateToDisplay]);

    const getEventsFromDate = (date: Date, isMonth: boolean) => {
        const eventsOnDate: IEvent[] = [];

        const sourceDateInDayJs = dayjs(date);

        const addEventIfMatchDate = (
            eventDateDayJs: dayjs.Dayjs,
            calendarGroup: ICalendarGroups,
            originalEvent: IEvent,
            unit: 'hours' | 'day',
        ) => {
            if (eventDateDayJs.isSame(sourceDateInDayJs, unit) && selectedCalendarGroupsIds.includes(calendarGroup.id)) {
                eventsOnDate.push({
                    ...originalEvent,
                    color: originalEvent.color ?? calendarGroup.color,
                });
            }
        };

        isMonth
            ? innerCalendarGroups.forEach(calendarGroup => {
                calendarGroup.events.forEach(event => {
                    const eventDateDayJs = dayjs(event.date);

                    addEventIfMatchDate(eventDateDayJs, calendarGroup, event, 'day');
                });
            })
            : (
                innerCalendarGroups.forEach(calendarGroup => {
                    calendarGroup.events.forEach(event => {
                        const eventDate = new Date(event.date);
                        eventDate.setHours(eventDate.getHours(), 0, 0, 0);

                        const eventDateDayJs = dayjs(eventDate);
                        addEventIfMatchDate(eventDateDayJs, calendarGroup, event, 'hours');
                    });
                })
            );

        return eventsOnDate;
    };

    const createModalView = props.createEventModalProps?.component || components.ui.getView('content.CalendarSystemModalView');

    const createModalProps = React.useMemo(() => ({
        ...props.createEventModalProps,
        component: createModalView,
    }), [createModalView, props.createEventModalProps]);

    const onClickCreate = React.useCallback(() => {
        dispatch(openModal(createModalView, createModalProps));
    }, [createModalProps, createModalView, dispatch]);

    return components.ui.renderView(props.view || 'content.CalendarSystemView', {
        ...props,
        dateToDisplay,
        monthCalendarDays,
        calendarType,
        currentWeekDays,
        createModalProps,
        calendarGroups: innerCalendarGroups,
        calendarGroupsTitle: props.calendarGroups.title,
        selectedCalendarGroupsIds,
        onChangeType,
        onMonthChange,
        onClickControls,
        onClickCreate,
        getEventsFromDate,
        onChangeCalendarGroupsIds: (newSelectedCalendarGroupsIds: number[]) => setSelectedCalendarGroupsIds(newSelectedCalendarGroupsIds),
    });
}
