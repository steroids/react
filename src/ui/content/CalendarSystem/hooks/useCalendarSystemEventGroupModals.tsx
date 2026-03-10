import _maxBy from 'lodash-es/maxBy';
import React from 'react';
import {useDispatch} from 'react-redux';

import {openModal} from '../../../../actions/modal';
import {useTheme} from '../../../../hooks';
import useComponents from '../../../../hooks/useComponents';
import {IModalProps} from '../../../modal/Modal/Modal';
import {CalendarSystemEventGroupModalFields, CalendarSystemEventGroupModalViewProps, IEventGroup} from '../CalendarSystem';

const DEFAULT_ID = 1;
const PRIMARY_LIGHT = '#651fff';
const PRIMARY_DARK = '#9362ff';

export const useCalendarSystemEventGroupModals = (
    innerEventGroups: IEventGroup[],
    setInnerEventGroups: React.Dispatch<React.SetStateAction<IEventGroup[]>>,
    eventGroupModalProps: IModalProps,
) => {
    const dispatch = useDispatch();
    const components = useComponents();
    const {theme} = useTheme();

    const calendarModalView = eventGroupModalProps?.component || components.ui.getView('content.CalendarSystemEventGroupModalView');

    const defaultEventGroupColor = React.useMemo(() => theme === 'light' ? PRIMARY_LIGHT : PRIMARY_DARK, [theme]);

    const onSubmit = React.useCallback((fields: Record<CalendarSystemEventGroupModalFields, string>) => {
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
            onEventGroupSubmit: onSubmit,
            eventGroupInitialValues: {
                color: defaultEventGroupColor,
            },
        } as CalendarSystemEventGroupModalViewProps));
    }, [calendarModalView, defaultEventGroupColor, dispatch, onSubmit]);

    return {
        openCreateEventGroupModal,
    };
};
