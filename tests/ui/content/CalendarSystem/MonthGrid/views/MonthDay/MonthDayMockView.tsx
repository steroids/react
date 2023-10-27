/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import _take from 'lodash-es/take';
import _slice from 'lodash-es/slice';
import _get from 'lodash-es/get';
import _isEmpty from 'lodash-es/isEmpty';
import _cloneDeep from 'lodash-es/cloneDeep';
import useBem from '../../../../../../../src/hooks/useBem';
import CalendarEnum from '../../../../../../../src/ui/content/CalendarSystem/enums/CalendarType';
import {IDay, IEvent} from '../../../../../../../src/ui/content/CalendarSystem/CalendarSystem';
import Tooltip from '../../../../../../../src/ui/layout/Tooltip/Tooltip';
import {Button} from '../../../../../../../src/ui/form';
import useExpandClickAway from '../../../../../../../src/ui/content/CalendarSystem/hooks/useExpandClickAway';

export const getFormattedExpandRestLabel = (rest: any[]) => `Показать ещё +${rest.length}`;

const SIXTH_ELEMENT_INDEX = 6;

interface IMonthDayProps {
    day: IDay;
    getEventsFromDate: (dateFromDay: Date, currentCalendarType: CalendarEnum) => IEvent[];
    openEditModal: (event: IEvent) => void,
    openCreateModal: (eventInitialDay?: IDay) => void;
}

export default function MonthDay(props: IMonthDayProps) {
    const bem = useBem('MonthDay');

    const {day, getEventsFromDate} = props;

    const {isExpanded, setIsExpanded, triggerRef: monthDayRef} = useExpandClickAway();

    const {
        events,
        hasSixEvents,
    } = React.useMemo(() => {
        const callingDate = new Date(props.day.date);

        const events = getEventsFromDate(callingDate, CalendarEnum.MONTH);

        const dayHasMoreThanSixEvents = events.length > 6;

        return {
            events,
            hasSixEvents: dayHasMoreThanSixEvents,
        };
    }, [getEventsFromDate, props.day.date]);

    const formattedExpandLabel = React.useMemo(() => getFormattedExpandRestLabel(
        _slice([...events], SIXTH_ELEMENT_INDEX),
    ), [events]);

    const renderEvent = React.useCallback((event: IEvent, eventIndex: number) => (
        <Tooltip
            key={event.id}
            position='rightBottom'
            content={event.title}
            className={bem.element('tooltip')}
        >
            <span
                className={bem.element('event')}
                data-eventid={event.id}
            >
                <span
                    className={bem.element('event-dot')}
                    style={{backgroundColor: event.color}}
                />
                {event.title}
            </span>
        </Tooltip>
    ), [bem]);

    const handleEventClick = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        const eventFromHour = event.target as HTMLDivElement;
        const eventId: number = _get(eventFromHour, 'dataset.eventid');

        if (!eventId) {
            return;
        }

        const [requiredEvent] = events.filter(hourEvent => hourEvent.id === Number(eventId));

        props.openEditModal(requiredEvent);
    }, [events, props]);

    const handleOnContextMenuCreateClick = React.useCallback((e: React.MouseEvent) => {
        e.preventDefault();

        const day: IDay = _cloneDeep(props.day);
        day.date.setHours(0, 0, 0, 0);
        props.openCreateModal(day);
    }, [props]);

    return (
        <div
            className={bem(
                bem.block({
                    outOfRange: day.outOfRange,
                    isToday: day.isToday,
                }),
            )}
            ref={monthDayRef}
            onClick={handleEventClick}
            onContextMenu={handleOnContextMenuCreateClick}
        >
            <div className={bem.element('wrapper')}>
                <span className={bem.element('number')}>{day.dayNumber.toString()}</span>
                <div className={bem.element('content', {
                    isExpanded,
                })}
                >
                    {events.map(renderEvent)}
                    {hasSixEvents && !isExpanded && (
                        <Button
                            link
                            className={bem.element('expand-button')}
                            onClick={() => setIsExpanded(true)}
                        >
                            {formattedExpandLabel}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
