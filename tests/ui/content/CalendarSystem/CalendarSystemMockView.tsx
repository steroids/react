import React from 'react';
import useBem from '../../../../src/hooks/useBem';
import Calendar from '../../../../src/ui/content/Calendar';
import {ICalendarSystemViewProps} from '../../../../src/ui/content/CalendarSystem/CalendarSystem';
import CalendarEnum from '../../../../src/ui/content/CalendarSystem/enums/CalendarType';
import AsideHeader from './AsideHeader/AsideHeaderMockView';
import AsideCalendars from './AsideCalendars/AsideCalendarsMockView';
import ContentHeader from './ContentHeader/ContentHeaderMockView';
import MonthGrid from './MonthGrid/MonthGridMockView';
import WeekGrid from './WeekGrid/WeekGridMockView';
import CalendarMockVIew from '../Calendar/CalendarMockView';

export default function CalendarSystemView(props: ICalendarSystemViewProps) {
    const bem = useBem('CalendarSystemView');

    return (
        <div
            className={bem(
                bem.block(),
                props.className,
            )}
            style={props.style}
        >
            <aside className={bem.element('aside')}>
                <AsideHeader
                    onClick={props.openCreateModal}
                    className={bem.element('aside-header')}
                />
                <Calendar
                    showFooter={false}

                    onMonthChange={props.onMonthChange}
                />
                <AsideCalendars
                    eventGroups={props.eventGroups}
                    eventGroupsTitle={props.eventGroupsTitle}
                    selectedCalendarGroupsIds={props.selectedCalendarGroups}
                    onChangeEventGroupsIds={props.onChangeEventGroupsIds}
                />
            </aside>
            <div className={bem.element('content')}>
                <ContentHeader
                    dateToDisplay={props.dateToDisplay}
                    onChangeCalendarType={props.onChangeCalendarType}
                    applyControl={props.applyControl}
                />
                {props.calendarType === CalendarEnum.MONTH
                    ? (
                        <MonthGrid
                            monthCalendarDays={props.monthCalendarDays}
                            getEventsFromDate={props.getEventsFromDate}
                            weekDays={props.weekDays}
                            openEditModal={props.openEditModal}
                            openCreateModal={props.openCreateModal}
                        />
                    )
                    : (
                        <WeekGrid
                            allHours={props.allHours}
                            getEventsFromDate={props.getEventsFromDate}
                            currentWeekDays={props.currentWeekDays}
                            openEditModal={props.openEditModal}
                            openCreateModal={props.openCreateModal}
                        />
                    )}
            </div>
        </div>
    );
}
