import React from 'react';
import {useDispatch} from 'react-redux';
import _isEqual from 'lodash-es/isEqual';
import _maxBy from 'lodash-es/maxBy';
import {openModal} from '../../../../actions/modal';
import {IModalProps} from '../../../modal/Modal/Modal';
import useComponents from '../../../../hooks/useComponents';
import {CalendarSystemModalFields, ICalendarSystemModalViewProps, IDay, IEvent, IEventGroup, IEventInitialValues} from '../CalendarSystem';
import {getOmittedEvent, sortEventsInGroup} from '../utils/utils';

const DEFAULT_ID = 0;

const useCalendarSystemModals = (
    calendarModalProps: IModalProps,
    innerEventGroups: IEventGroup[],
    setInnerEventGroups: React.Dispatch<React.SetStateAction<IEventGroup[]>>,
) => {
    const dispatch = useDispatch();
    const components = useComponents();
    const calendarModalView = calendarModalProps?.component || components.ui.getView('content.CalendarSystemModalView');

    const onModalFormSubmit = React.useCallback((
        fields: Record<CalendarSystemModalFields, string | number>,
        eventInitialValues?: IEventInitialValues,
    ) => {
        const {eventGroupId, date, title, description} = fields;
        let currentEventGroups = [...innerEventGroups];

        if (eventInitialValues) {
            // Удаляем событие из предыдущей группы
            const previousGroupIndex = currentEventGroups.findIndex(group => group.id === Number(eventInitialValues.eventGroupId));
            const previousGroup = {...currentEventGroups[previousGroupIndex]};
            previousGroup.events = previousGroup.events.filter(event => event.id !== eventInitialValues.id);

            currentEventGroups = [
                ...currentEventGroups.slice(0, previousGroupIndex),
                previousGroup,
                ...currentEventGroups.slice(previousGroupIndex + 1),
            ];
        }

        const changeableEventGroupIndex = currentEventGroups.findIndex(group => group.id === eventGroupId);
        const changeableEventGroup = {...currentEventGroups[changeableEventGroupIndex]};

        const updatedEvent = {
            id: (_maxBy(changeableEventGroup.events, event => event.id)?.id || DEFAULT_ID) + 1,
            date: new Date(date),
            title: title as string,
            description: description as string,
        };

        changeableEventGroup.events.push(updatedEvent);
        changeableEventGroup.events = sortEventsInGroup(changeableEventGroup);

        currentEventGroups = [
            ...currentEventGroups.slice(0, changeableEventGroupIndex),
            changeableEventGroup,
            ...currentEventGroups.slice(changeableEventGroupIndex + 1),
        ];

        setInnerEventGroups(currentEventGroups);
    }, [innerEventGroups, setInnerEventGroups]);

    const getModalProps = React.useCallback((isCreate: boolean, eventInitialValues?: Partial<IEvent & {eventGroupId: number,}>) => ({
        ...calendarModalProps,
        component: calendarModalView,
        eventGroups: innerEventGroups,
        onModalFormSubmit,
        isCreate,
        eventInitialValues,
    }) as ICalendarSystemModalViewProps, [calendarModalProps, calendarModalView, innerEventGroups, onModalFormSubmit]);

    const getEventFromGroup = React.useCallback((event: IEvent) => innerEventGroups
        .find(group => group.events
            .some(groupEvent => _isEqual(getOmittedEvent(groupEvent), getOmittedEvent(event)))), [innerEventGroups]);

    const openCreateModal = React.useCallback((eventInitialDay: IDay = null) => {
        const modalProps = eventInitialDay
            ? getModalProps(true, {date: eventInitialDay.date}) : getModalProps(true);

        dispatch(openModal(calendarModalView, modalProps));
    }, [calendarModalView, dispatch, getModalProps]);

    const openEditModal = React.useCallback((event: IEvent) => {
        const eventGroupId = getEventFromGroup(event)?.id || 0;
        dispatch(openModal(calendarModalView, getModalProps(false, {...event,
eventGroupId})));
    }, [getModalProps, calendarModalView, dispatch, getEventFromGroup]);

    return {
        openCreateModal,
        openEditModal,
        getEventFromGroup,
        getModalProps,
    };
};

export default useCalendarSystemModals;
