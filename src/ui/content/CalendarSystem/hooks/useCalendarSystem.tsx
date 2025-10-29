/* eslint-disable default-case */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useMount} from 'react-use';
import {useDispatch} from 'react-redux';
import _last from 'lodash-es/last';
import _head from 'lodash-es/head';
import {ICalendarSystemProps, ICalendarUser, IEventGroup} from '../CalendarSystem';
import useDisplayDate from './useDisplayDate';
import {useDayGrid} from './useDayGrid';
import {useCalendarType} from './useCalendarType';
import useMonthGrid from './useMonthGrid';
import useWeekGrid from './useWeekGrid';
import useCalendarControls from './useCalendarControls';
import useCalendarSystemModals from './useCalendarSystemModals';
import {useCalendarSystemEventGroupModals} from './useCalendarSystemEventGroupModals';
import {useEventsFromDate} from './useEventsFromDate';
import DisplayDateFormatType from '../enums/DisplayDateFormatType';
import {getFormattedDay} from '../utils/utils';
import {formChange, formInitialize} from '../../../../actions/form';
import CalendarType from '../enums/CalendarType';

const DEFAULT_DATE_FROM_ATTRIBUTE = 'dateFrom';
const DEFAULT_DATE_TO_ATTRIBUTE = 'dateTo';

export const useCalendarSystem = (props: ICalendarSystemProps) => {
    const dispatch = useDispatch();

    const [innerEventGroups, setInnerEventGroups] = React.useState<IEventGroup[]>(props.eventBlock.eventGroups || []);
    const [selectedEventGroupsIds, setSelectedEventGroupsIds] = React.useState<number[]>([]);
    const [users, setUsers] = useState<ICalendarUser[]>(props.users);

    React.useEffect(() => {
        setInnerEventGroups(props.eventBlock.eventGroups);
    }, [props.eventBlock.eventGroups]);

    React.useEffect(() => {
        setUsers(props.users);
    }, [props.users]);

    //Главная дата, от которой происходят все вычисления
    const [generalCurrentDay, setGeneralCurrentDay] = React.useState(getFormattedDay(null, props.timeZone));
    const isGeneralCurrentDayNeedsUpdate = useRef(true);

    const updateGeneralCurrentDay = useCallback(
        (newDate: Date) => {
            if (!isGeneralCurrentDayNeedsUpdate.current) {
                isGeneralCurrentDayNeedsUpdate.current = true;
                return;
            }
            setGeneralCurrentDay(getFormattedDay(newDate, props.timeZone));
        },
        [isGeneralCurrentDayNeedsUpdate, props.timeZone],
    );

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
        props.timeZone,
    );

    const {
        weekGridTwentyFourHoursArray,
        weekGridCurrentWeekDays,
    } = useWeekGrid(
        generalCurrentDay,
        props.timeZone,
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
        if (newType === CalendarType.DAY) {
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

    // save dateTo and dateFrom in redux
    const dateFromAttribute = props.calendarDatesFormData?.dateFromAttribute || DEFAULT_DATE_FROM_ATTRIBUTE;
    const dateToAttribute = props.calendarDatesFormData?.dateToAttribute || DEFAULT_DATE_TO_ATTRIBUTE;

    useMount(() => {
        if (props.calendarDatesFormData) {
            dispatch(formInitialize(
                props.calendarDatesFormData.formId,
                {
                    [dateFromAttribute]: null,
                    [dateToAttribute]: null,
                },
            ));
        }
    });

    React.useEffect(() => {
        if (props.calendarDatesFormData) {
            const currentDateArray = calendarType === CalendarType.MONTH
                ? monthGridCalendarDays
                : weekGridCurrentWeekDays;

            const newFormValues = {
                [dateFromAttribute]: _head(currentDateArray).date,
                [dateToAttribute]: _last(currentDateArray).date,
            };

            if (calendarType === CalendarType.DAY) {
                newFormValues[dateFromAttribute] = dayGridCurrentDay.date;
                newFormValues[dateToAttribute] = dayGridCurrentDay.date;
            }

            dispatch(formChange(props.calendarDatesFormData.formId, newFormValues));
        }
    }, [
        calendarType,
        dateFromAttribute,
        dateToAttribute,
        dayGridCurrentDay,
        dispatch,
        monthGridCalendarDays,
        props.calendarDatesFormData,
        weekGridCurrentWeekDays,
    ]);

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
