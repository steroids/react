import * as React from 'react';
import useBem from '../../../../src/hooks/useBem';
import {ICalendarSystemViewProps} from '../../../../src/ui/content/CalendarSystem/CalendarSystem';
import CalendarEnum from '../../../../src/ui/content/CalendarSystem/enums/CalendarType';
import AsideHeader from './AsideHeader/AsideHeaderMockView';
import AsideCalendars from './AsideCalendars/AsideCalendarsMockView';
import ContentHeader from './ContentHeader/ContentHeaderMockView';
import MonthGrid from './MonthGrid/MonthGridMockView';
import WeekGrid from './WeekGrid/WeekGridMockView';

export default function CalendarSystemView(props: ICalendarSystemViewProps) {
    const bem = useBem('CalendarSystemView');

    const calendarTypeGrids = React.useMemo(() => ({
        [CalendarEnum.MONTH]: <MonthGrid {...props.monthGridProps} />,
        [CalendarEnum.WEEK]: <WeekGrid {...props.weekGridProps} />,
    }), [props.monthGridProps, props.weekGridProps]);

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
                {/* <Calendar
                    showFooter={false}
                    onMonthChange={props.onInnerCalendarChangeMonth}
                /> */}
                <AsideCalendars
                    eventGroups={props.eventGroups}
                    eventGroupsTitle={props.eventGroupsTitle}
                    onChangeEventGroupsIds={props.onChangeEventGroupsIds}
                    openCreateEventGroupModal={props.openCreateEventGroupModal}
                />
            </aside>
            <div className={bem.element('content')}>
                <ContentHeader
                    dateToDisplay={props.dateToDisplay}
                    onChangeCalendarType={props.handleCalendarTypeChange}
                    handleControlClick={props.handleControlClick}
                />
                {calendarTypeGrids[props.calendarType as string]}
            </div>
        </div>
    );
}
