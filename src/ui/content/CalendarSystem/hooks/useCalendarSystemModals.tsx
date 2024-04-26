import React from 'react';
import {useDispatch} from 'react-redux';
import _isEqual from 'lodash-es/isEqual';
import _maxBy from 'lodash-es/maxBy';
import _cloneDeep from 'lodash-es/cloneDeep';
import {openModal} from '../../../../actions/modal';
import {IModalProps} from '../../../modal/Modal/Modal';
import useComponents from '../../../../hooks/useComponents';
import {
    CalendarSystemModalFields,
    ICalendarSystemModalViewProps,
    ICalendarUser,
    IDay,
    IEvent,
    IEventGroup,
    IEventInitialValues,
} from '../CalendarSystem';
import {getOmittedEvent, sortEventsInGroup} from '../utils/utils';

const DEFAULT_ID = 1;

const useCalendarSystemModals = (
    calendarModalProps: IModalProps,
    innerEventGroups: IEventGroup[],
    setInnerEventGroups: React.Dispatch<React.SetStateAction<IEventGroup[]>>,
    users: ICalendarUser[],
    setUsers: React.Dispatch<React.SetStateAction<ICalendarUser[]>>,
) => {
    const dispatch = useDispatch();
    const components = useComponents();
    const calendarModalView = calendarModalProps?.component || components.ui.getView('content.CalendarSystemModalView');

    const onModalFormSubmit = React.useCallback((
        fields: Record<CalendarSystemModalFields, string | number | number[] | Date>,
        eventInitialValues?: IEventInitialValues,
    ) => {
        const {id, eventGroupId, startDate, title, description, endDate, usersIds} = fields;
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
            id: id || (_maxBy(changeableEventGroup.events, event => event.id)?.id || DEFAULT_ID) + 1,
            startDate: new Date(startDate as Date),
            endDate: new Date(endDate as Date),
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

        const newUsers = (_cloneDeep(users) as ICalendarUser[]).map(user => {
            if (!(usersIds as number[]).includes(user.id)) {
                return user;
            }

            return ({
                ...user,
                eventsIds: [
                    ...user.eventsIds,
                    updatedEvent.id,
                ] as number[],
            });
        });

        setUsers(newUsers);
    }, [innerEventGroups, setInnerEventGroups, setUsers, users]);

    const getModalProps = React.useCallback((isCreate: boolean, eventInitialValues?: Partial<IEvent & {eventGroupId: number, }>) => ({
        ...calendarModalProps,
        component: calendarModalView,
        eventGroups: innerEventGroups,
        onModalFormSubmit,
        isCreate,
        eventInitialValues,
        users,
    }) as ICalendarSystemModalViewProps, [calendarModalProps, calendarModalView, innerEventGroups, onModalFormSubmit, users]);

    const getEventFromGroup = React.useCallback((event: IEvent) => innerEventGroups
        .find(group => group.events
            .some(groupEvent => _isEqual(getOmittedEvent(groupEvent), getOmittedEvent(event)))), [innerEventGroups]);

    const openCreateModal = React.useCallback((eventInitialDay: IDay = null) => {
        const modalProps = eventInitialDay
            ? getModalProps(true, {startDate: eventInitialDay.date}) : getModalProps(true);

        dispatch(openModal(calendarModalView, modalProps));
    }, [calendarModalView, dispatch, getModalProps]);

    const openEditModal = React.useCallback((event: IEvent) => {
        const eventGroupId = getEventFromGroup(event)?.id || 0;
        dispatch(openModal(calendarModalView, getModalProps(false, {
            ...event,
            eventGroupId,
            usersIds: users.map(user => {
                if (!user.eventsIds.includes(event.id)) {
                    return null;
                }

                return user.id;
            }).filter(Boolean),
        })));
    }, [getEventFromGroup, dispatch, calendarModalView, getModalProps, users]);

    return {
        openCreateModal,
        openEditModal,
        getEventFromGroup,
        getModalProps,
    };
};

export default useCalendarSystemModals;
