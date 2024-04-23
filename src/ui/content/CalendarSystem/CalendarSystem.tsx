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
import {useComponents} from '../../../hooks';
import {useCalendarSystem} from './hooks/useCalendarSystem';
import CalendarEnum from './enums/CalendarType';

dayjs.extend(localeData);

export type CalendarSystemModalFields = 'title' | 'eventGroupId' | 'date' | 'description';
export type CalendarSystemEventGroupModalFields = 'label' | 'color';

export interface IEventInitialValues extends IEvent {
    eventGroupId: string,
}
export interface IDay {
    dayNumber: number,
    date: Date,
    outOfRange?: boolean,
    isToday?: boolean,
    formattedDisplay?: string,
}

export interface IPresentDateInfo {
    currentYear: number,
    currentMonth: number,
    dateToDisplay: string,
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

export interface ICalendarUser {
    id: number,
    name: string,
    caption: string,
    eventIds: IEvent['id'][],
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
    onChangeCalendarType?: (newType: string) => void,
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
    * Свойства для сетки вида дня
    */
    dayGrid?: {
        //TODO сделать eventView
        eventView?: CustomView,
    },

    users?: ICalendarUser[],

    /**
    * Дополнительные свойства, которые передаются во view компонента
    */
    additionalViewProps?: Record<string, any>,

    [key: string]: any,
}

export interface ICalendarSystemViewProps extends Pick<ICalendarSystemProps, 'className' | 'style' | 'additionalViewProps' | 'users'> {
    onInnerCalendarChangeMonth: (newDate: Date) => void,
    eventGroups: IEventGroup[],
    eventGroupsTitle: string,
    onChangeEventGroupsIds: (selectedIds: number[]) => void,
    openCreateEventGroupModal: VoidFunction,
    dateToDisplay: string,
    handleCalendarTypeChange: (newType: string) => void,
    handleControlClick: (event: React.MouseEvent<HTMLElement>) => void,
    calendarType: CalendarEnum,

    getEventsFromDate: (dateFromDay: Date, currentCalendarType: CalendarEnum) => IEvent[],
    openEditModal: (event: IEvent) => void,
    openCreateModal: (eventInitialDay?: IDay) => void,

    monthGridProps: {
        monthGridWeekDays: string[],
        monthGridCalendarDays: IDay[],
    },

    weekGridProps: {
        weekGridTwentyFourHoursArray: string[],
        weekGridCurrentWeekDays: IDay[],
    },

    dayGridProps: {
        dayGridTwentyFourHoursArray: string[],
        dayGridCurrentDay: IDay,
    },
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
        label: string,
    },
}

export default function CalendarSystem(props: ICalendarSystemProps) {
    const components = useComponents();

    const calendarSystem = useCalendarSystem(props);

    const viewProps: ICalendarSystemViewProps = React.useMemo(() => ({
        className: props.className,
        style: props.style,
        additionalViewProps: props.additionalViewProps,
        users: props.users,
        eventGroupsTitle: props.eventBlock.title,

        dateToDisplay: calendarSystem.dateToDisplay,
        eventGroups: calendarSystem.innerEventGroups,
        calendarType: calendarSystem.calendarType,

        openCreateModal: calendarSystem.openCreateModal,
        onInnerCalendarChangeMonth: calendarSystem.onInnerCalendarChangeMonth,
        onChangeEventGroupsIds: (newSelectedEventGroupsIds: number[]) => calendarSystem.setSelectedEventGroupsIds(newSelectedEventGroupsIds),
        openCreateEventGroupModal: calendarSystem.openCreateEventGroupModal,
        handleCalendarTypeChange: calendarSystem.handleCalendarTypeChange,
        handleControlClick: calendarSystem.handleControlClick,
        getEventsFromDate: calendarSystem.getEventsFromDate,
        openEditModal: calendarSystem.openEditModal,

        monthGridProps: {
            monthGridWeekDays: calendarSystem.monthGridWeekDays,
            monthGridCalendarDays: calendarSystem.monthGridCalendarDays,
        },
        weekGridProps: {
            weekGridTwentyFourHoursArray: calendarSystem.weekGridTwentyFourHoursArray,
            weekGridCurrentWeekDays: calendarSystem.weekGridCurrentWeekDays,
        },
        dayGridProps: {
            dayGridTwentyFourHoursArray: calendarSystem.dayGridTwentyFourHoursArray,
            dayGridCurrentDay: calendarSystem.dayGridCurrentDay,
        },
    }), [props.className, props.style, props.additionalViewProps, props.users, props.eventBlock.title, calendarSystem]);

    return components.ui.renderView(props.view || 'content.CalendarSystemView', viewProps);
}
