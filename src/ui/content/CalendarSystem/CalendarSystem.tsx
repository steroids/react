/* eslint-disable default-case */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
import React from 'react';
import dayjs from 'dayjs';
import _concat from 'lodash-es/concat';
import _slice from 'lodash-es/slice';
import localeData from 'dayjs/plugin/localeData';
import _upperFirst from 'lodash-es/upperFirst';
import {IModalProps} from '../../../ui/modal/Modal/Modal';
import {openModal} from '../../../actions/modal';
import useCalendarControls from './hooks/useCalendarControls';
import useDisplayDate from './hooks/useDisplayDate';
import useMonthCalendar from './hooks/useMonthCalendar';
import {useComponents, useDispatch, useWeekCalendar} from '../../../hooks';
import {addEventIfMatchDate} from './helpers/addEventIfMatchDate';
import CalendarEnum from './enums/CalendarType';

dayjs.extend(localeData);

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

export interface IEventGroup {
    id: number,
    label: string,
    color?: string,
    events: IEvent[],
}

export interface ICalendarSystemProps extends IUiComponent {
    onCreateEvent?: () => void;
    onChangeCalendarType?: (newType: string) => void;
    createEventModalProps?: IModalProps,
    eventBlock: {
        title: string,
        eventGroups: IEventGroup[],
    },
    [key: string]: any;
}

export interface ICalendarSystemViewProps extends Omit<ICalendarSystemProps, 'calendarGroups'> {
    monthCalendarDays: IDay[],
    currentWeekDays: IDay[],
    allHours: string[],
    calendarType: CalendarEnum,
    dateToDisplay: string,
    eventGroups: IEventGroup[],
    eventGroupsTitle: string,
    selectedCalendarGroupsIds: number[],
    onChangeCalendarType: (newType: string) => void,
    onMonthChange: (newDate: Date) => void,
    applyControl: (event: React.MouseEvent<HTMLElement>) => void
    onClickCreate: VoidFunction,
    getEventsFromDate: (dateFromDay: Date, isMonth: boolean) => IEvent[],
    onChangeEventGroupsIds: (selectedIds: number[]) => void,
    weekDays: string[],
}

export type ICalendarSystemModalViewProps = IModalProps

export default function CalendarSystem(props: ICalendarSystemProps) {
    const components = useComponents();
    const dispatch = useDispatch();
    const [innerEventGroups, _] = React.useState<IEventGroup[]>(props.eventBlock.eventGroups || []);
    const [selectedEventGroupsIds, setSelectedEventGroupsIds] = React.useState<number[]>([]);
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

    const applyControl = useCalendarControls(calendarType, weekControls);

    const onChangeCalendarType = React.useCallback((newType: string) => {
        setCalendarType(newType);

        if (props.onChangeCalendarType) {
            props.onChangeCalendarType(newType);
        }
    }, [props]);

    const onMonthChange = React.useCallback((newDate: Date) => {
        setNewDateToDisplay(newDate);
        setCurrentMonthDate(newDate);
        forceUpdateWeekOnMonthChange(newDate);
    }, [forceUpdateWeekOnMonthChange, setCurrentMonthDate, setNewDateToDisplay]);

    const getEventsFromDate = (date: Date, currentCalendarType: CalendarEnum) => {
        const eventsOnDate: IEvent[] = [];

        const dayjsDate = dayjs(date);

        const iterateEventGroups = (callback: (event: IEvent, eventGroup: IEventGroup) => void) => {
            innerEventGroups.forEach(eventGroup => {
                eventGroup.events.forEach(event => {
                    callback(event, eventGroup);
                });
            });
        };

        switch (currentCalendarType) {
            case CalendarEnum.MONTH: {
                iterateEventGroups((event, eventGroup) => {
                    const eventDateDayJs = dayjs(event.date);

                    addEventIfMatchDate(
                        eventDateDayJs,
                        dayjsDate,
                        eventGroup,
                        event,
                        'day',
                        selectedEventGroupsIds,
                        eventsOnDate,
                    );
                });
                break;
            }

            case CalendarEnum.WEEK: {
                iterateEventGroups((event, eventGroup) => {
                    const eventDate = new Date(event.date);
                    eventDate.setHours(eventDate.getHours(), 0, 0, 0);

                    const eventDateDayJs = dayjs(eventDate);

                    addEventIfMatchDate(
                        eventDateDayJs,
                        dayjsDate,
                        eventGroup,
                        event,
                        'hours',
                        selectedEventGroupsIds,
                        eventsOnDate,
                    );
                });
                break;
            }
        }

        // eslint-disable-next-line consistent-return
        return eventsOnDate;
    };

    const weekDays = React.useMemo(() => {
        const unformattedDaysOfWeek = dayjs.weekdaysMin();

        return _concat(_slice(unformattedDaysOfWeek, 1), unformattedDaysOfWeek[0]).map(weekDay => __(`${_upperFirst(weekDay)}`));
    }, []);

    const allHours = React.useMemo(() => {
        const hoursArray = [];
        for (let i = 0; i < 24; i++) {
            const formattedHour = dayjs().startOf('day').add(i, 'hour').format('HH:00');
            hoursArray.push(formattedHour);
        }
        return hoursArray;
    }, []);

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
        eventGroups: innerEventGroups,
        eventGroupsTitle: props.eventBlock.title,
        allHours,
        selectedEventGroupsIds,
        onChangeCalendarType,
        onMonthChange,
        applyControl,
        onClickCreate,
        getEventsFromDate,
        onChangeEventGroupsIds: (newSelectedEventGroupsIds: number[]) => setSelectedEventGroupsIds(newSelectedEventGroupsIds),
        weekDays,
    });
}
