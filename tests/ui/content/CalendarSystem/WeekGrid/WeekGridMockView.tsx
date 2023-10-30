import React from 'react';
import CalendarEnum from '../../../../../src/ui/content/CalendarSystem/enums/CalendarType';
import useBem from '../../../../../src/hooks/useBem';
import Text from '../../../../../src/ui/typography/Text/Text';
import {IDay, IEvent} from '../../../../../src/ui/content/CalendarSystem/CalendarSystem';
import WeekHour from './views/WeekHour/WeekMockHour';

interface IWeekGridProps {
    currentWeekDays: IDay[]
    allHours: string[],
    getEventsFromDate: (dateFromDay: Date, currentCalendarType: CalendarEnum) => IEvent[];
    openEditModal: (event: IEvent) => void,
    openCreateModal: (eventInitialDay?: IDay) => void;
}

function WeekGrid(props: IWeekGridProps) {
    const bem = useBem('WeekGrid');

    const {currentWeekDays, getEventsFromDate} = props;

    const renderWeekHours = React.useCallback(
        (hour) => currentWeekDays.map((dayOfWeek, dayOfWeekIndex) => (
            <WeekHour
                hour={hour}
                getEventsFromDate={getEventsFromDate}
                key={dayOfWeekIndex}
                dayOfWeek={dayOfWeek}
                openEditModal={props.openEditModal}
                openCreateModal={props.openCreateModal}
            />
        )),
        [currentWeekDays, getEventsFromDate, props.openCreateModal, props.openEditModal],
    );

    return (
        <div className={bem.block()}>
            <div className={bem.element('content')}>
                <div className={bem.element('hours-time')}>
                    {props.allHours.map((hour, hourIndex) => (
                        <div
                            key={hourIndex}
                            className={bem.element('hours-time-item')}
                        >
                            {hour}
                        </div>
                    ))}
                </div>

                <div className={bem.element('table')}>
                    <div className={bem.element('table-heading')}>
                        {currentWeekDays.map((weekDay, weekDayIndex) => (
                            <Text
                                key={weekDayIndex}
                                className={bem.element('day', {
                                    isToday: weekDay.isToday,
                                })}
                            >
                                <span className={bem.element('day-wrapper')}>
                                    {weekDay.formattedDisplay}
                                </span>
                            </Text>
                        ))}
                    </div>
                    <div className={bem.element('table-grid')}>
                        {props.allHours.map((hour, hourIndex) => (
                            <div
                                key={hourIndex}
                                className={bem.element('table-grid-row')}
                            >
                                {renderWeekHours(hour)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(WeekGrid);
