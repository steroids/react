/* eslint-disable max-len */
/* eslint-disable no-return-assign */
/* eslint-disable default-case */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
import React from 'react';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import _take from 'lodash-es/take';
import _omit from 'lodash-es/omit';
import _maxBy from 'lodash-es/maxBy';
import _isEqual from 'lodash-es/isEqual';
import _set from 'lodash-es/set';
import _pullAt from 'lodash-es/pullAt';
import _indexOf from 'lodash-es/indexOf';
import {IModalProps} from '../../../ui/modal/Modal/Modal';
import useCalendarControls from './hooks/useCalendarControls';
import useDisplayDate from './hooks/useDisplayDate';
import useMonthGrid from './hooks/useMonthGrid';
import {useComponents} from '../../../hooks';
import CalendarEnum from './enums/CalendarType';
import useCalendarSystemModals from './hooks/useCalendarSystemModals';
import {useCalendarSystemEventGroupModals} from './hooks/useCalendarSystemEventGroupModals';
import useWeekGrid from './hooks/useWeekGrid';
import {useCalendarType} from './hooks/useCalendarType';
import {useEventsFromDate} from './hooks/useEventsFromDate';

dayjs.extend(localeData);

export type CalendarSystemModalFields = 'title' | 'eventGroupId' | 'date' | 'description';
export type CalendarSystemEventGroupModalFields = 'label' | 'color';

export interface IEventInitialValues extends IEvent {
    eventGroupId: string;
}
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

/**
* Событие
*/
export interface IEvent {
    /**
    * Идентификатор
    */
    id: number,
    /**
    * Дата
    */
    date: Date,
    /**
    * Заголовок
    */
    title: string,

    /**
    * Цвет
    */
    color?: string,

    /**
    * Внутреннее описания события
    */
    description?: string,
    [key: string]: any,
}

/**
* Группа событий
*/
export interface IEventGroup {
    /**
    * Идентификатор
    */
    id: number,
    /**
    * Название группы
    */
    label: string,
    /**
    * Цвет
    * @example '#000000'
    */
    color?: string,
    /**
    * События группы
    */
    events: Omit<IEvent, 'color'>[],
}

/**
 * CalendarSystem
 *
 * Комплексный компонент календарь служит для планирования событий и их отображения в календаре.
 *
 * Компонент умеет отображать события с помощью недельной сетки с шагом в 1 час,
 * а также переключать отображение на сетку по месяцам с шагом 1 день.
 * Присутствует возможность добавлять в календарь события и создавать новые группы событий.
 *
 */
export interface ICalendarSystemProps extends IUiComponent {
    /**
    * Функция, которая вызовется при смене типа календаря
    */
    onChangeCalendarType?: (newType: string) => void;
    /**
    * Свойства для модального окна
    */
    calendarModalProps?: IModalProps,
    /**
    * Свойства для модалного окна группы событий
    */
    eventGroupModalProps?: IModalProps,
    /**
    * Параметры для групп событий
    */
    eventBlock: {
        /**
        * Заголовок, который используется для обозначения групп событий
        */
        title: string,
        /**
        * Группы событий
        */
        eventGroups: IEventGroup[],
    },
    /**
    * Дополнительные свойства, которые передаются во view компонента
    */
    additionalViewProps?: Record<string, any>,

    [key: string]: any;
}

export interface ICalendarSystemViewProps extends Pick<ICalendarSystemProps, 'className' | 'style'> {
    openCreateModal: (eventInitialDay?: IDay) => void;
    onInnerCalendarChangeMonth: (newDate: Date) => void,
    eventGroups: IEventGroup[],
    eventGroupsTitle: string,
    onChangeEventGroupsIds: (selectedIds: number[]) => void,
    openCreateEventGroupModal: VoidFunction,
    dateToDisplay: string,
    handleCalendarTypeChange: (newType: string) => void,
    handleControlClick: (event: React.MouseEvent<HTMLElement>) => void
    calendarType: CalendarEnum,

    monthGridProps: {
        monthGridWeekDays: string[],
        monthGridCalendarDays: IDay[],
        getEventsFromDate: (dateFromDay: Date, currentCalendarType: CalendarEnum) => IEvent[];
        openEditModal: (event: IEvent) => void;
        openCreateModal: (eventInitialDay?: IDay) => void;
    }
    weekGridProps: {
        weekGrid24HoursArray: string[],
        weekGridCurrentWeekDays: IDay[],
        getEventsFromDate: (dateFromDay: Date, currentCalendarType: CalendarEnum) => IEvent[];
        openEditModal: (event: IEvent) => void;
        openCreateModal: (eventInitialDay?: IDay) => void;
    }
}

export interface ICalendarSystemModalViewProps extends IModalProps {
    eventGroups: IEventGroup[],
    onModalFormSubmit: (fields: Record<CalendarSystemModalFields, string>, eventInitialValues?: IEventInitialValues) => void,
    isCreate: boolean,
    eventInitialValues?: any,
}

export interface CalendarSystemEventGroupModalViewProps extends IModalProps {
    isCreate: boolean,
    onEventGroupSubmit: (fields: Record<CalendarSystemEventGroupModalFields, string>) => void,
    eventGroupInitialValues?: {
        color: string,
        label: string
    }
}

export default function CalendarSystem(props: ICalendarSystemProps) {
    const components = useComponents();

    const [innerEventGroups, setInnerEventGroups] = React.useState<IEventGroup[]>(props.eventBlock.eventGroups || []);
    const [selectedEventGroupsIds, setSelectedEventGroupsIds] = React.useState<number[]>([]);
    const [currentMonthFirstDayDate, setCurrentMonthFirstDayDate] = React.useState<Date | null>(null);

    const {dateToDisplay, setNewDateToDisplay} = useDisplayDate();

    const {calendarType, handleCalendarTypeChange} = useCalendarType();

    const {
        monthGridWeekDays,
        monthGridCalendarDays,
    } = useMonthGrid(
        currentMonthFirstDayDate,
        setCurrentMonthFirstDayDate,
    );

    const {
        weekGrid24HoursArray,
        weekGridCurrentWeekDays,
        weekGridControls,
        updateWeekOnMonthChange,
    } = useWeekGrid(
        currentMonthFirstDayDate,
    );

    const handleControlClick = useCalendarControls(calendarType, weekGridControls);

    const {
        openCreateModal,
        openEditModal,
    } = useCalendarSystemModals(
        props.calendarModalProps,
        innerEventGroups,
        setInnerEventGroups,
    );

    const {openCreateEventGroupModal} = useCalendarSystemEventGroupModals(
        innerEventGroups,
        setInnerEventGroups,
        props.eventGroupModalProps,
    );

    const onInnerCalendarChangeMonth = React.useCallback((newDate: Date) => {
        setNewDateToDisplay(newDate);
        setCurrentMonthFirstDayDate(newDate);
        updateWeekOnMonthChange(newDate);
    }, [updateWeekOnMonthChange, setCurrentMonthFirstDayDate, setNewDateToDisplay]);

    const {getEventsFromDate} = useEventsFromDate(innerEventGroups, selectedEventGroupsIds);

    const viewProps: ICalendarSystemViewProps = React.useMemo(() => ({
        className: props.className,
        style: props.style,
        openCreateModal,
        onInnerCalendarChangeMonth,
        eventGroups: innerEventGroups,
        eventGroupsTitle: props.eventBlock.title,
        onChangeEventGroupsIds: (newSelectedEventGroupsIds: number[]) => setSelectedEventGroupsIds(newSelectedEventGroupsIds),
        openCreateEventGroupModal,
        dateToDisplay,
        handleCalendarTypeChange,
        handleControlClick,
        calendarType,

        monthGridProps: {
            monthGridWeekDays,
            monthGridCalendarDays,
            getEventsFromDate,
            openCreateModal,
            openEditModal,
        },
        weekGridProps: {
            weekGrid24HoursArray,
            weekGridCurrentWeekDays,
            getEventsFromDate,
            openCreateModal,
            openEditModal,
        },
    }), [
        props.className,
        props.style,
        props.eventBlock.title,
        openCreateModal,
        onInnerCalendarChangeMonth,
        innerEventGroups,
        openCreateEventGroupModal,
        dateToDisplay,
        handleCalendarTypeChange,
        handleControlClick,
        calendarType,
        monthGridWeekDays,
        monthGridCalendarDays,
        getEventsFromDate,
        openEditModal,
        weekGrid24HoursArray,
        weekGridCurrentWeekDays,
    ]);

    return components.ui.renderView(props.view || 'content.CalendarSystemView', viewProps);
}
