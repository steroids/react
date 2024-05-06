/* eslint-disable max-len */
import {useMemo} from 'react';
import {ICalendarSystemProps} from '../CalendarSystem';
import {useComponents} from '../../../../hooks';

export interface ICustomViews {
    renderEventView: (componentProps: any) => JSX.Element,
    renderHourView: (componentProps: any) => JSX.Element,
    renderGridView: (componentProps: any) => JSX.Element,
}

const DEFAULT_DAY_GRID_VIEWS = {
    eventView: 'content.CalendarSystemDayEventView',
    hourView: 'content.CalendarSystemDayHourView',
    gridView: 'content.CalendarSystemDayGridView',
};
const DEFAULT_WEEK_GRID_VIEWS = {
    eventView: 'content.CalendarSystemWeekEventView',
    hourView: 'content.CalendarSystemWeekHourView',
    gridView: 'content.CalendarSystemWeekGridView',
};

const DEFAULT_MONTH_GRID_VIEWS = {
    eventView: 'content.CalendarSystemMonthEventView',
    hourView: 'content.CalendarSystemMonthHourView',
    gridView: 'content.CalendarSystemMonthGridView',
};

export const useCustomViews = (props: Pick<ICalendarSystemProps, 'dayGrid' | 'weekGrid' | 'monthGrid'>) => {
    const components = useComponents();

    const dayGridViews = useMemo(() => ({
        renderEventView: (componentProps: any) => components.ui.renderView(props?.dayGrid?.eventView || DEFAULT_DAY_GRID_VIEWS.eventView, componentProps),
        renderHourView: (componentProps: any) => components.ui.renderView(props?.dayGrid?.hourView || DEFAULT_DAY_GRID_VIEWS.hourView, componentProps),
        renderGridView: (componentProps: any) => components.ui.renderView(props?.dayGrid?.gridView || DEFAULT_DAY_GRID_VIEWS.gridView, componentProps),
    }), [components.ui, props]);

    const weekGridViews = useMemo(() => ({
        renderEventView: (componentProps: any) => components.ui.renderView(props?.weekGrid?.eventView || DEFAULT_WEEK_GRID_VIEWS.eventView, componentProps),
        renderHourView: (componentProps: any) => components.ui.renderView(props?.weekGrid?.hourView || DEFAULT_WEEK_GRID_VIEWS.hourView, componentProps),
        renderGridView: (componentProps: any) => components.ui.renderView(props?.weekGrid?.gridView || DEFAULT_WEEK_GRID_VIEWS.gridView, componentProps),
    }), [components.ui, props]);

    const monthGridViews = useMemo(() => ({
        renderEventView: (componentProps: any) => components.ui.renderView(props?.monthGrid?.eventView || DEFAULT_MONTH_GRID_VIEWS.eventView, componentProps),
        renderHourView: (componentProps: any) => components.ui.renderView(props?.monthGrid?.hourView || DEFAULT_MONTH_GRID_VIEWS.hourView, componentProps),
        renderGridView: (componentProps: any) => components.ui.renderView(props?.monthGrid?.gridView || DEFAULT_MONTH_GRID_VIEWS.gridView, componentProps),
    }), [components.ui, props]);

    return {
        dayGridViews,
        weekGridViews,
        monthGridViews,
    };
};
