import {useDispatch} from 'react-redux';
import _maxBy from 'lodash-es/maxBy';
import React from 'react';
import {openModal} from '../../../../actions/modal';
import useComponents from '../../../../hooks/useComponents';
import {CalendarSystemEventGroupModalFields, CalendarSystemEventGroupModalViewProps, IEventGroup} from '../CalendarSystem';

const DEFAULT_ID = 1;

export const useCalendarSystemEventGroupModals = (
    innerEventGroups: IEventGroup[],
    setInnerEventGroups: React.Dispatch<React.SetStateAction<IEventGroup[]>>,
) => {
    const dispatch = useDispatch();
    const components = useComponents();
    const calendarModalView = components.ui.getView('content.CalendarSystemEventGroupModalView');

    const onEventGroupSubmit = React.useCallback((fields: Record<CalendarSystemEventGroupModalFields, string>) => {
        const newEventGroup: IEventGroup = {
            id: (_maxBy(innerEventGroups, eventsGroup => eventsGroup.id)?.id || DEFAULT_ID) + 1,
            label: fields.label,
            color: fields.color,
            events: [],
        };

        setInnerEventGroups(prev => [...prev, newEventGroup]);
    }, [innerEventGroups, setInnerEventGroups]);

    const openCreateEventGroupModal = React.useCallback(() => {
        dispatch(openModal(calendarModalView, {
            isCreate: true,
            onEventGroupSubmit,
        } as CalendarSystemEventGroupModalViewProps));
    }, [calendarModalView, dispatch, onEventGroupSubmit]);

    return {
        openCreateEventGroupModal,
    };
};
