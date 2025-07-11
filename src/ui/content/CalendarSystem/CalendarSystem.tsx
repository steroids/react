/* eslint-disable max-len */
/* eslint-disable no-return-assign */
/* eslint-disable default-case */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import {MouseEvent, ReactNode, useMemo} from 'react';
import {ICheckboxListFieldProps} from '../../../ui/form/CheckboxListField/CheckboxListField';
import {ICalendarProps} from '../../../ui/content/Calendar/Calendar';
import {IModalProps} from '../../../ui/modal/Modal/Modal';
import {useComponents} from '../../../hooks';
import {useCalendarSystem} from './hooks/useCalendarSystem';
import {ICustomViews, useCustomViews} from './hooks/useCustomViews';

dayjs.extend(localeData);

export type CalendarSystemModalFields = 'title' | 'eventGroupId' | 'description' | 'startDate' | 'endDate' | 'id' | 'usersIds';
export type CalendarSystemEventGroupModalFields = 'label' | 'color';

export interface IEventInitialValues extends IEvent {
    eventGroupId: string,
    usersIds: number[],
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
    * Начальная дата
    */
    startDate: Date,
    /**
    * Конечная дата
    */
    endDate: Date,
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
    id: number | string,
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
    eventsIds: IEvent['id'][],
}

export interface IGridViews {
    eventView?: CustomView,
    hourView?: CustomView,
    gridView?: CustomView,
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
    * Функция, которая вызывется при смене типа календаря
    */
    onChangeCalendarType?: (newType: string) => void,

    /**
    * Свойства для модального окна
    */
    calendarModalProps?: IModalProps,

    /**
    * Свойства для модального окна группы событий
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

        /**
        * Можно ли добавлять группы событий в календарь
        */
        canAddedEventGroups?: boolean,
    },

    /**
    * Свойства для сетки дня
    */
    dayGrid?: IGridViews,

    /**
    * Свойства для сетки недели
    */
    weekGrid?: IGridViews,

    /**
    * Свойства для сетки месяца
    */
    monthGrid?: IGridViews,

    users: ICalendarUser[],

    /**
    * Дополнительные свойства, которые передаются во view компонента
    */
    additionalViewProps?: Record<string, any>,

    /**
     * Дополнительные свойства для бокового календаря
     */
    asideCalendarProps?: ICalendarProps,

    /**
     * Дополнительные свойства для списка календарей бокового календаря
     */
    asideCalendarCheckboxListProps?: ICheckboxListFieldProps,

    /**
     * Дочерние элементы
     */
    children?: ReactNode,

    /**
     * Функция, которая вызывается по клику на событие
     */
    onEventClick?: (event: Record<string, any>) => void,

    /**
     * Данные для формы с текущими датами календаря
     */
    calendarDatesFormData?: {
        formId: string,
        dateFromAttribute?: string,
        dateToAttribute?: string,
    },

    [key: string]: any,
}

export interface ICalendarSystemViewProps extends Pick<ICalendarSystemProps, 'className' | 'style' | 'additionalViewProps' | 'users' | 'asideCalendarProps' | 'asideCalendarCheckboxListProps'> {
    onCalendarChangedMonth: (newDate: Date) => void,
    eventGroups: IEventGroup[],
    eventGroupsTitle: string,
    canAddedEventGroups?: boolean,
    onChangeEventGroupsIds: (selectedIds: number[]) => void,
    openCreateEventGroupModal: VoidFunction,
    dateToDisplay: string,
    handleCalendarTypeChange: (newType: string) => void,
    onClickControl: (event: MouseEvent<HTMLElement>) => void,
    calendarType: string,
    children: ReactNode,

    getEventsFromDate: (dateFromDay: Date, currentCalendarType: string) => IEvent[],
    openEditModal: (event: IEvent) => void,
    openCreateModal: (eventInitialDay?: IDay) => void,

    monthGridProps: {
        monthGridWeekDays: string[],
        monthGridCalendarDays: IDay[],
    } & ICustomViews,

    weekGridProps: {
        weekGridTwentyFourHoursArray: string[],
        weekGridCurrentWeekDays: IDay[],
    } & ICustomViews,

    dayGridProps: {
        dayGridTwentyFourHoursArray: string[],
        dayGridCurrentDay: IDay,
    } & ICustomViews,
}

export interface ICalendarSystemModalViewProps extends IModalProps {
    eventGroups: IEventGroup[],
    onModalFormSubmit: (fields: Record<CalendarSystemModalFields, string>, eventInitialValues?: IEventInitialValues) => void,
    isCreate: boolean,
    eventInitialValues?: any,
    users: ICalendarUser[],
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

    const {dayGridViews, monthGridViews, weekGridViews} = useCustomViews(props);

    const viewProps: ICalendarSystemViewProps = useMemo(() => ({
        className: props.className,
        style: props.style,
        additionalViewProps: props.additionalViewProps,
        users: calendarSystem.users,
        eventGroupsTitle: props.eventBlock.title,
        canAddedEventGroups: props.eventBlock.canAddedEventGroups,
        asideCalendarProps: props.asideCalendarProps,
        asideCalendarCheckboxListProps: props.asideCalendarCheckboxListProps,
        children: props.children,

        dateToDisplay: calendarSystem.dateToDisplay,
        eventGroups: calendarSystem.innerEventGroups,
        calendarType: calendarSystem.calendarType,

        openCreateModal: calendarSystem.openCreateModal,
        onCalendarChangedMonth: calendarSystem.onCalendarChangedMonth,
        onChangeEventGroupsIds: (newSelectedEventGroupsIds: number[]) => calendarSystem.setSelectedEventGroupsIds(newSelectedEventGroupsIds),
        openCreateEventGroupModal: calendarSystem.openCreateEventGroupModal,
        handleCalendarTypeChange: calendarSystem.handleCalendarTypeChange,
        onClickControl: calendarSystem.onClickControl,
        getEventsFromDate: calendarSystem.getEventsFromDate,
        openEditModal: props.onEventClick || calendarSystem.openEditModal,

        monthGridProps: {
            monthGridWeekDays: calendarSystem.monthGridWeekDays,
            monthGridCalendarDays: calendarSystem.monthGridCalendarDays,
            ...monthGridViews,
        },
        weekGridProps: {
            weekGridTwentyFourHoursArray: calendarSystem.weekGridTwentyFourHoursArray,
            weekGridCurrentWeekDays: calendarSystem.weekGridCurrentWeekDays,
            ...weekGridViews,
        },
        dayGridProps: {
            dayGridTwentyFourHoursArray: calendarSystem.dayGridTwentyFourHoursArray,
            dayGridCurrentDay: calendarSystem.dayGridCurrentDay,
            ...dayGridViews,
        },
    }), [props.className, props.style, props.additionalViewProps, props.eventBlock.title, props.eventBlock.canAddedEventGroups, props.asideCalendarProps, props.asideCalendarCheckboxListProps, props.children, props.onEventClick, calendarSystem, monthGridViews, weekGridViews, dayGridViews]);

    return components.ui.renderView(props.view || 'content.CalendarSystemView', viewProps);
}
