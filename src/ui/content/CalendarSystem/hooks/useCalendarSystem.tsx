import React from 'react';
import {ICalendarSystemProps, IEventGroup} from '../CalendarSystem';
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

export const useCalendarSystem = (props: ICalendarSystemProps) => {
    const [innerEventGroups, setInnerEventGroups] = React.useState<IEventGroup[]>(props.eventBlock.eventGroups || []);
    const [selectedEventGroupsIds, setSelectedEventGroupsIds] = React.useState<number[]>([]);
    const [currentMonthFirstDayDate, setCurrentMonthFirstDayDate] = React.useState<Date | null>(null);

    const {dateToDisplay, setNewDateToDisplay} = useDisplayDate();

    const {dayGridTwentyFourHoursArray, dayGridCurrentDay} = useDayGrid(props.dayGrid);

    const {calendarType, handleCalendarTypeChange} = useCalendarType();

    const {
        monthGridWeekDays,
        monthGridCalendarDays,
    } = useMonthGrid(
        currentMonthFirstDayDate,
        setCurrentMonthFirstDayDate,
    );

    const {
        weekGridTwentyFourHoursArray,
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
        setSelectedEventGroupsIds,
        handleCalendarTypeChange,
        getEventsFromDate,
        onInnerCalendarChangeMonth,
        openCreateEventGroupModal,
        openEditModal,
        openCreateModal,
        handleControlClick,
    };
};
