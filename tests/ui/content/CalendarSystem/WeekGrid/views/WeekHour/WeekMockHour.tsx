/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-shadow */
import _slice from 'lodash-es/slice';
import _get from 'lodash-es/get';
import _cloneDeep from 'lodash-es/cloneDeep';
import {MouseEvent, useCallback, useMemo} from 'react';
import useBem from '../../../../../../../src/hooks/useBem';
import {convertDate} from '../../../../../../../src/utils/calendar';
import {IDay, IEvent} from '../../../../../../../src/ui/content/CalendarSystem/CalendarSystem';
import {Button} from '../../../../../../../src/ui/form';
import CalendarEnum from '../../../../../../../src/ui/content/CalendarSystem/enums/CalendarType';
import Tooltip from '../../../../../../../src/ui/layout/Tooltip/Tooltip';
import useExpandClickAway from '../../../../../../../src/ui/content/CalendarSystem/hooks/useExpandClickAway';

export const getFormattedExpandRestLabel = (rest: any[]) => `Показать ещё +${rest.length}`;

const FOURTH_ELEMENT_INDEX = 3;

interface IWeekHourProps {
    dayOfWeek: IDay,
    getEventsFromDate: (dateFromDay: Date, currentCalendarType: CalendarEnum) => IEvent[],
    hour: string,
    openEditModal: (event: IEvent) => void,
    openCreateModal: (eventInitialDay?: IDay) => void,
}

export default function WeekHour(props: IWeekHourProps) {
    const bem = useBem('WeekHour');

    const {isExpanded, setIsExpanded, triggerRef: weekHourRef} = useExpandClickAway();

    const {
        events,
        hasOneEvent,
        hasTwoEvents,
        hasTreeEvents,
        hasMoreThanFourEvents,
    } = useMemo(() => {
        const callingDate = new Date(props.dayOfWeek.date);

        const timeArray = props.hour.replace(':', '').split('');

        callingDate.setHours(Number(timeArray[0] + timeArray[1]), 0, 0, 0);

        const events = props.getEventsFromDate(callingDate, CalendarEnum.WEEK);

        const hasOneEvent = events.length === 1;
        const hasTwoEvents = events.length === 2;
        const hasMoreThanTreeEvents = events.length >= 3;
        const hasMoreThanFourEvents = events.length > 3;

        return {
            events,
            hasOneEvent,
            hasTwoEvents,
            hasTreeEvents: hasMoreThanTreeEvents,
            hasMoreThanFourEvents,
        };
    }, [props]);

    const renderEvent = useCallback((event: IEvent, eventIndex: number) => (
        <Tooltip
            position='rightBottom'
            content={event.title}
            className={bem.element('tooltip')}
            key={eventIndex}
        >
            <div
                className={bem.element('hour-event')}
                style={{backgroundColor: event.color}}
                title={event.title}
                data-eventid={event.id}
            >
                <span className={bem.element('hour-event-title')}>
                    {event.title}
                </span>
                <span className={bem.element('hour-event-time')}>
                    {convertDate(event.date, null, 'HH:mm')}
                </span>
            </div>
        </Tooltip>
    ), [bem]);

    const formattedExpandLabel = useMemo(() => getFormattedExpandRestLabel(
        _slice([...events], FOURTH_ELEMENT_INDEX),
    ), [events]);

    const handleEventClick = useCallback((event: MouseEvent<HTMLElement>) => {
        const eventFromHour = event.target as HTMLDivElement;
        const eventId: number = _get(eventFromHour, 'dataset.eventid');

        if (!eventId) {
            return;
        }

        const [requiredEvent] = events.filter(hourEvent => hourEvent.id === Number(eventId));

        props.openEditModal(requiredEvent);
    }, [events, props]);

    const handleOnContextMenuCreateClick = useCallback((e: MouseEvent) => {
        e.preventDefault();

        const day: IDay = _cloneDeep(props.dayOfWeek);
        day.date.setHours(Number(convertDate(props.hour, 'HH:mm', 'H')), 0, 0, 0);
        props.openCreateModal(day);
    }, [props]);

    return (
        <div
            className={bem.element('hour', {
                isToday: props.dayOfWeek.isToday,
                hasOneEvent,
                hasTwoEvents,
                hasTreeEvents,
                isExpanded,
            })}
            ref={weekHourRef}
            onClick={handleEventClick}
            onContextMenu={handleOnContextMenuCreateClick}
        >
            {events.map(renderEvent)}
            {hasMoreThanFourEvents && !isExpanded && (
                <Button
                    link
                    className={bem.element('expand-button')}
                    onClick={() => setIsExpanded(true)}
                >
                    {formattedExpandLabel}
                </Button>
            )}
        </div>
    );
}
