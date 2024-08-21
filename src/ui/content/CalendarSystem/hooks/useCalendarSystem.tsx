import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ICalendarSystemProps, ICalendarUser, IEventGroup} from '../CalendarSystem';
import useDisplayDate from './useDisplayDate';
import {useDayGrid} from './useDayGrid';
import {useCalendarType} from './useCalendarType';
import CalendarEnum from '../enums/CalendarType';
import useMonthGrid from './useMonthGrid';
import useWeekGrid from './useWeekGrid';
import useCalendarControls from './useCalendarControls';
import useCalendarSystemModals from './useCalendarSystemModals';
import {useCalendarSystemEventGroupModals} from './useCalendarSystemEventGroupModals';
import {useEventsFromDate} from './useEventsFromDate';
import DisplayDateFormatType from '../enums/DisplayDateFormatType';
import {getFormattedDay} from '../utils/utils';

export const useCalendarSystem = (props: ICalendarSystemProps) => {
    const [innerEventGroups, setInnerEventGroups] = React.useState<IEventGroup[]>(props.eventBlock.eventGroups || []);
    const [selectedEventGroupsIds, setSelectedEventGroupsIds] = React.useState<number[]>([]);
    const [users, setUsers] = useState<ICalendarUser[]>(props.users);

    React.useEffect(() => {
        setInnerEventGroups(props.eventBlock.eventGroups);
    }, [props.eventBlock.eventGroups]);

    //Главная дата, от которой происходят все вычисления
    const [generalCurrentDay, setGeneralCurrentDay] = React.useState(getFormattedDay());
    const isGeneralCurrentDayNeedsUpdate = useRef(true);

    const updateGeneralCurrentDay = useCallback((newDate: Date) => {
        if (!isGeneralCurrentDayNeedsUpdate.current) {
            isGeneralCurrentDayNeedsUpdate.current = true;
            return;
        }
        setGeneralCurrentDay(getFormattedDay(newDate));
    }, [isGeneralCurrentDayNeedsUpdate]);

    const onCalendarChangedMonth = React.useCallback((newDate: Date) => {
        updateGeneralCurrentDay(newDate);
    }, [updateGeneralCurrentDay]);

    const {
        dateToDisplay,
        changeDisplayFormat,
    } = useDisplayDate(generalCurrentDay);

    const {
        monthGridWeekDays,
        monthGridCalendarDays,
    } = useMonthGrid(
        generalCurrentDay,
    );

    const {
        weekGridTwentyFourHoursArray,
        weekGridCurrentWeekDays,
    } = useWeekGrid(
        generalCurrentDay,
    );

    const {
        dayGridTwentyFourHoursArray,
        dayGridCurrentDay,
    } = useDayGrid(
        generalCurrentDay,
    );

    const {
        calendarType,
        handleCalendarTypeChange,
    } = useCalendarType((newType) => {
        if (newType === CalendarEnum.DAY) {
            changeDisplayFormat(DisplayDateFormatType.DAY);
            return;
        }

        changeDisplayFormat(DisplayDateFormatType.DEFAULT);
    });

    const {
        onClickControl,
    } = useCalendarControls(
        calendarType,
        generalCurrentDay,
        setGeneralCurrentDay,
        isGeneralCurrentDayNeedsUpdate,
    );

    const {
        openCreateModal,
        openEditModal,
    } = useCalendarSystemModals(
        props.calendarModalProps,
        innerEventGroups,
        setInnerEventGroups,
        users,
        setUsers,
    );

    const {
        openCreateEventGroupModal,
    } = useCalendarSystemEventGroupModals(
        innerEventGroups,
        setInnerEventGroups,
        props.eventGroupModalProps,
    );

    const {
        getEventsFromDate,
    } = useEventsFromDate(
        innerEventGroups,
        selectedEventGroupsIds,
    );

    return {
        monthGridWeekDays,
        monthGridCalendarDays,

        weekGridTwentyFourHoursArray,
        weekGridCurrentWeekDays,

        dayGridTwentyFourHoursArray,
        dayGridCurrentDay,

        dateToDisplay,
        innerEventGroups,
        calendarType,
        users,
        setSelectedEventGroupsIds,
        handleCalendarTypeChange,
        getEventsFromDate,
        onCalendarChangedMonth,
        openCreateEventGroupModal,
        openEditModal,
        openCreateModal,
        onClickControl,
    };
};
