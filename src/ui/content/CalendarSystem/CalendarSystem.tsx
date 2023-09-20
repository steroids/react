/* eslint-disable no-plusplus */
import React from 'react';
import __upperFirst from 'lodash-es/upperFirst';
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

export interface Day {
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

export interface ICalendar {
    id: string;
    label: string;
    color: string;
}

export interface ICalendarSystemProps extends IUiComponent {
    calendars?: ICalendar[];
    onCreate?: () => void;
    onChangeType?: (newType: string) => void;
    calendarsTitle: string;
    createModalProps: IModalProps,
    [key: string]: any;
}

export interface ICalendarSystemViewProps extends ICalendarSystemProps {
    monthCalendar: Day[],
    currentWeek: Day[],
    calendarType: CalendarEnum,
    dateToDisplay: string,
    onChangeType: (newType: string) => void,
    onMonthChange: (newDate: Date) => void,
    onClickControls: (event: React.MouseEvent<HTMLElement>) => void
    onClickCreate: VoidFunction,
}

export interface ICalendarSystemModalViewProps extends IModalProps {
    onCreate: VoidFunction
}

export default function CalendarSystem(props: ICalendarSystemProps) {
    const components = useComponents();
    const dispatch = useDispatch();

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
        onChangeType,
        onMonthChange,
        onClickControls,
        onClickCreate,
    });
}

CalendarSystem.defaultProps = {
    calendarsTitle: 'My Calendars',
};
