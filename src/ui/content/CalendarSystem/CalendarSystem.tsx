/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
import React from 'react';
import __upperFirst from 'lodash-es/upperFirst';
import {convertDate} from 'src/utils/calendar';
import dayjs from 'dayjs';
import {IModalProps} from '../../../ui/modal/Modal/Modal';
import {openModal} from '../../../actions/modal';
import useCalendarControls from '../../../hooks/useCalendarControls';
import DateControlEnum from '../../../enums/DateControlType';
import useDisplayDate from '../../../hooks/useDisplayDate';
import useMonthCalendar from '../../../hooks/useMonthCalendar';
import {useComponents, useDispatch, useWeekCalendar} from '../../../hooks';
import CalendarEnum from '../../../enums/CalendarType';

export const DAYS_OF_WEEK = [
    __('Mo'),
    __('Tu'),
    __('We'),
    __('Th'),
    __('Fr'),
    __('Sa'),
    __('Su'),
];

export const HOURS = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
];

export interface IDay {
    dayNumber: number;
    date: Date;
    outOfRange?: boolean;
    isToday?: boolean;
    formattedDisplay?: string,
}

export interface PresentDateInfo {
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

export interface ICalendar {
    id: number,
    label: string,
    color: string,
    events: IEvent[],
}

export interface ICalendarSystemProps extends IUiComponent {
    onCreate?: () => void;
    onChangeType?: (newType: string) => void;
    createModalProps: IModalProps,
    calendars: {
        title: string,
        items: ICalendar[],
    },
    [key: string]: any;
}

export interface ICalendarSystemViewProps extends Omit<ICalendarSystemProps, 'calendars'> {
    monthCalendar: IDay[],
    currentWeek: IDay[],
    calendarType: CalendarEnum,
    dateToDisplay: string,
    calendars: ICalendar[],
    calendarsTitle: string,
    selectedCalendarsIds: number[],
    onChangeType: (newType: string) => void,
    onMonthChange: (newDate: Date) => void,
    onClickControls: (event: React.MouseEvent<HTMLElement>) => void
    onClickCreate: VoidFunction,
    getEventsFromDate: (dateFromDay: Date, isMonth: boolean) => IEvent[],
    onChangeCalendarsIds: (selectedIds: number[]) => void,
}

export interface ICalendarSystemModalViewProps extends IModalProps {
    onCreate: VoidFunction
}

export default function CalendarSystem(props: ICalendarSystemProps) {
    const components = useComponents();
    const dispatch = useDispatch();
    const [innerCalendars, setInnerCalendars] = React.useState<ICalendar[]>(props.calendars.items || []);
    const [selectedCalendarsIds, setSelectedCalendarsIds] = React.useState<number[]>([]);
    const {dateToDisplay, setNewDateToDisplay} = useDisplayDate();
    const [calendarType, setCalendarType] = React.useState<CalendarEnum>(CalendarEnum.Month);
    const {calendarArray, setCurrentMonthDate, currentMonthDate} = useMonthCalendar();

    const {
        currentWeek,
        weekControls,
        forceUpdateWeekOnMonthChange,
    } = useWeekCalendar(
        currentMonthDate,
    );

    const {applyControl} = useCalendarControls(calendarType, weekControls);

    const onChangeType = React.useCallback((newType: string) => {
        setCalendarType(CalendarEnum[newType]);

        if (props.onChangeType) {
            props.onChangeType(CalendarEnum[newType]);
        }
    }, [props]);

    const onMonthChange = React.useCallback((newDate: Date) => {
        setNewDateToDisplay(newDate);
        setCurrentMonthDate(newDate);
        forceUpdateWeekOnMonthChange(newDate);
    }, [forceUpdateWeekOnMonthChange, setCurrentMonthDate, setNewDateToDisplay]);

    const onClickControls = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as HTMLDivElement;
        const controlType: DateControlEnum = target.dataset?.control;

        if (!controlType) {
            return;
        }

        applyControl(controlType);
    }, [applyControl]);

    const onChangeCalendarsIds = (selectedIds: number[]) => {
        setSelectedCalendarsIds(selectedIds);
    };

    const getEventsFromDate = (date: Date, isMonth: boolean) => {
        const result: IEvent[] = [];

        const callingDateDayJs = dayjs(date);

        isMonth
            ? innerCalendars.forEach(calendar => {
                calendar.events.forEach(event => {
                    const eventDateDayJs = dayjs(event.date);

                    if (eventDateDayJs.isSame(callingDateDayJs, 'day') && selectedCalendarsIds.includes(calendar.id)) {
                        result.push({
                            ...event,
                            color: event.color ?? calendar.color,
                        });
                    }
                });
            })
            : (
                innerCalendars.forEach(calendar => {
                    calendar.events.forEach(event => {
                        const eventDate = new Date(event.date);

                        eventDate.setHours(eventDate.getHours(), 0, 0, 0);

                        const eventDateDayJs = dayjs(eventDate);

                        if (eventDateDayJs.isSame(callingDateDayJs, 'hours') && selectedCalendarsIds.includes(calendar.id)) {
                            result.push({
                                ...event,
                                color: event.color ?? calendar.color,
                            });
                        }
                    });
                })
            );

        return result;
    };

    const createModalView = props.createModalProps?.component || components.ui.getView('content.CalendarSystemModalView');

    const createModalProps = React.useMemo(() => ({
        ...props.createModalProps,
        component: createModalView,
    }), [createModalView, props.createModalProps]);

    const onClickCreate = React.useCallback(() => {
        dispatch(openModal(createModalView, createModalProps));
    }, [createModalProps, createModalView, dispatch]);

    return components.ui.renderView(props.view || 'content.CalendarSystemView', {
        ...props,
        dateToDisplay,
        monthCalendar: calendarArray,
        calendarType,
        currentWeek,
        createModalProps,
        calendars: innerCalendars,
        calendarsTitle: props.calendars.title,
        selectedCalendarsIds,
        onChangeType,
        onMonthChange,
        onClickControls,
        onClickCreate,
        getEventsFromDate,
        onChangeCalendarsIds,
    });
}

CalendarSystem.defaultProps = {
    calendarsTitle: 'My Calendars',
};
