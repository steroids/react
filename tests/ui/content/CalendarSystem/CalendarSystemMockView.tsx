/* eslint-disable max-len */
import { useMemo } from 'react';
import useBem from '../../../../src/hooks/useBem';
import {ICalendarSystemViewProps} from '../../../../src/ui/content/CalendarSystem/CalendarSystem';
import CalendarEnum from '../../../../src/ui/content/CalendarSystem/enums/CalendarType';
import AsideHeader from './AsideHeader/AsideHeaderMockView';
import AsideCalendars from './AsideCalendars/AsideCalendarsMockView';
import ContentHeader from './ContentHeader/ContentHeaderMockView';

export default function CalendarSystemView(props: ICalendarSystemViewProps) {
    const bem = useBem('CalendarSystemView');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const sharedFunctions = {
        getEventsFromDate: props.getEventsFromDate,
        openEditModal: props.openEditModal,
        openCreateModal: props.openCreateModal,
    };

    const {
        dayGridProps: {renderGridView: renderDayGrid},
        weekGridProps: {renderGridView: renderWeekGrid},
        monthGridProps: {renderGridView: renderMonthGrid},
    } = props;

    const calendarTypeGrids = useMemo(() => ({
        [CalendarEnum.MONTH]: (
            <>
                {renderMonthGrid({
                    ...props.monthGridProps,
                    ...sharedFunctions,
                })}
            </>
        ),
        [CalendarEnum.WEEK]: (
            <>
                {renderWeekGrid({
                    ...props.weekGridProps,
                    ...sharedFunctions,
                })}
            </>
        ),
        [CalendarEnum.DAY]: (
            <>
                {renderDayGrid({
                    ...props.dayGridProps,
                    ...sharedFunctions,
                    users: props.users,
                })}
            </>
        ),
    }), [props.dayGridProps, props.monthGridProps, props.users, props.weekGridProps, renderDayGrid, renderMonthGrid, renderWeekGrid, sharedFunctions]);

    return (
        <div
            className={bem(
                bem.block(),
                props.className,
            )}
            style={props.style}
        >
            <aside className={bem.element('aside')}>
                {/* <AsideHeader
                    openCreateModal={props.openCreateModal}
                    className={bem.element('aside-header')}
                />
                <Calendar
                    showFooter={false}
                    onMonthChange={props.onCalendarChangedMonth}
                />
                <AsideCalendars
                    eventGroups={props.eventGroups}
                    eventGroupsTitle={props.eventGroupsTitle}
                    onChangeEventGroupsIds={props.onChangeEventGroupsIds}
                    openCreateEventGroupModal={props.openCreateEventGroupModal}
                /> */}
            </aside>
            <div className={bem.element('content')}>
                {/* <ContentHeader
                    dateToDisplay={props.dateToDisplay}
                    handleCalendarTypeChange={props.handleCalendarTypeChange}
                    onClickControl={props.onClickControl}
                /> */}
                {calendarTypeGrids[props.calendarType as string]}
            </div>
        </div>
    );
}
