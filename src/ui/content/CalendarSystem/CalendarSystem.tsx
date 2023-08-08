/* eslint-disable no-plusplus */
import React from 'react';
import __upperFirst from 'lodash-es/upperFirst';
import {useDateData} from '../../../hooks/useDateData';
import {convertDate} from '../../../utils/calendar';
import {useMonthCalendar} from '../../../hooks/useMonthCalendar';
import {useComponents} from '../../../hooks';
import CalendarEnum from '../../../enums/CalendarType';

export const MONTH_CONVERT_FORMAT = 'MMMM YYYY';

export interface Day {
    dayNumber: number;
    date: Date;
    outOfRange?: boolean;
    isToday?: boolean;
}

export interface PresentDateInfo {
    currentYear: number;
    currentMonth: number;
    dateToDisplay: string;
}

export interface ICalendar {
    id: string;
    label: string;
    color: string;
}

export interface ICalendarSystemProps extends IUiComponent {
    calendars?: ICalendar[];
    onCreate?: () => void;
    onChangeType?: (newType: string) => void;
    calendarsTitle: string;
    [key: string]: any;
}

export interface ICalendarSystemViewProps extends ICalendarSystemProps {
    currentMonth: string,
    monthCalendar: Day[],
    calendarType: CalendarEnum,
    allDateInfo: PresentDateInfo,
    onCreateHandler: VoidFunction,
    onChangeType: (newType: string) => void,

    onClickNextPrev: () => void,
}

export default function CalendarSystem(props: ICalendarSystemProps) {
    const components = useComponents();
    const {getCurrentMonth, getCurrentYearUTC, getFirstDayOfCurrentMonth} = useDateData();
    const [calendarType, setCalendarType] = React.useState<CalendarEnum>(CalendarEnum.Month);
    const {calendarArray} = useMonthCalendar();

    const allDateInfo: PresentDateInfo = React.useMemo(() => ({
        currentYear: getCurrentYearUTC(),
        currentMonth: getCurrentMonth(),
        dateToDisplay: __upperFirst(convertDate(getFirstDayOfCurrentMonth(), null, MONTH_CONVERT_FORMAT)),
    }), [getCurrentMonth, getCurrentYearUTC, getFirstDayOfCurrentMonth]);

    const onChangeType = React.useCallback((newType: string) => {
        setCalendarType(CalendarEnum[newType]);

        if (props.onChangeType) {
            props.onChangeType(CalendarEnum[newType]);
        }
    }, [props]);

    const onCreateHandler = React.useCallback(() => {
        if (props.onCreate) {
            props.onCreate();
        }
    }, [props]);

    return components.ui.renderView(props.view || 'content.CalendarSystemView', {
        ...props,
        allDateInfo,
        monthCalendar: calendarArray,
        calendarType,
        onChangeType,
        onCreateHandler,
    });
}

CalendarSystem.defaultProps = {
    calendarsTitle: 'My Calendars',
};
