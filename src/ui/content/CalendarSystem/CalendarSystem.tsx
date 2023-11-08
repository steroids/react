/* eslint-disable no-return-assign */
/* eslint-disable default-case */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
import React from 'react';
import dayjs from 'dayjs';
import _concat from 'lodash-es/concat';
import _slice from 'lodash-es/slice';
import localeData from 'dayjs/plugin/localeData';
import _upperFirst from 'lodash-es/upperFirst';
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
import useMonthCalendar from './hooks/useMonthCalendar';
import {useComponents, useWeekCalendar} from '../../../hooks';
import {addEventIfMatchDate} from './helpers/addEventIfMatchDate';
import CalendarEnum from './enums/CalendarType';
import useCalendarSystemModals from './hooks/useCalendarSystemModals';
import {useCalendarSystemEventGroupModals} from './hooks/useCalendarSystemEventGroupModals';

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
    openCreateModal: (eventInitialDay?: IDay) => void;
    openCreateEventGroupModal: VoidFunction,
    openEditModal: (event: IEvent) => void;
    getEventsFromDate: (dateFromDay: Date, currentCalendarType: CalendarEnum) => IEvent[];
    onChangeEventGroupsIds: (selectedIds: number[]) => void,
    weekDays: string[],
}

export interface ICalendarSystemModalViewProps extends IModalProps {
    eventGroups: IEventGroup[],
    onEventSubmit: (fields: Record<CalendarSystemModalFields, string>, eventInitialValues?: IEventInitialValues) => void,
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
                    callback(event as IEvent, eventGroup);
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

    return components.ui.renderView(props.view || 'content.CalendarSystemView', {
        ...props,
        dateToDisplay,
        monthCalendarDays,
        calendarType,
        currentWeekDays,
        eventGroups: innerEventGroups,
        eventGroupsTitle: props.eventBlock.title,
        allHours,
        selectedEventGroupsIds,
        onChangeCalendarType,
        onMonthChange,
        applyControl,
        openCreateModal,
        getEventsFromDate,
        onChangeEventGroupsIds: (newSelectedEventGroupsIds: number[]) => setSelectedEventGroupsIds(newSelectedEventGroupsIds),
        openCreateEventGroupModal,
        openEditModal,
        weekDays,
    });
}
