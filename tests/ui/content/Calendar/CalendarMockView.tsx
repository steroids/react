import * as React from 'react';
import {useCallback, useMemo} from 'react';
import DayPicker, {DateUtils} from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import {CaptionElementProps} from 'react-day-picker/types/Props';

import CaptionElement from './CaptionElementMockView';
import {useBem} from '../../../../src/hooks';
import {ICalendarViewProps} from '../../../../src/ui/content/Calendar/Calendar';

export default function CalendarView(props: ICalendarViewProps) {
    const bem = useBem('CalendarView');

    const {
        month,
        toYear,
        fromYear,
        showFooter,
        onDaySelect,
        selectedDates,
        onMonthSelect,
        numberOfMonths,
        toggleCaptionPanel,
        isCaptionPanelVisible,
    } = props;

    const isRange = !!selectedDates[0] && !!selectedDates[1];
    const {selectedDays, modifiers} = useMemo(() => {
        const from = selectedDates[0];
        const to = selectedDates[1];
        const inRange = (day) => DateUtils.isDayAfter(day, from) && DateUtils.isDayBefore(day, to);
        const outRange = (day) => DateUtils.isDayBefore(day, from);
        return {
            selectedDays: isRange
                ? [from, {
                    from,
                    to,
                }]
                : from,
            modifiers: isRange && !DateUtils.isSameDay(from, to)
                ? {
                    start: from,
                    end: to,
                    inRange,
                }
                : undefined,
        };
    }, [isRange, selectedDates]);

    const renderCaptionElement = useCallback(({classNames, date, localeUtils, locale}: CaptionElementProps) => (
        <CaptionElement
            date={date}
            locale={locale}
            toYear={toYear}
            fromYear={fromYear}
            classNames={classNames}
            onChange={onMonthSelect}
            localeUtils={localeUtils}
            showCalendarFooter={showFooter}
            toggleCaptionPanel={toggleCaptionPanel}
            isCaptionPanelVisible={isCaptionPanelVisible}
        />
    ), [fromYear, isCaptionPanelVisible, onMonthSelect, showFooter, toYear, toggleCaptionPanel]);

    return (
        <DayPicker
            {...props}
            className={bem(bem.block({ranged: isRange}), props.className)}
            captionElement={renderCaptionElement}
            renderDay={(day) => {
                const date = day.getDate();
                return (
                    <div
                        className={bem.element('day')}
                    >
                        {date}
                    </div>
                );
            }}
            todayButton={showFooter && (isCaptionPanelVisible ? __('Закрыть') : __('Сегодня'))}
            onTodayButtonClick={(day) => {
                if (isCaptionPanelVisible) {
                    toggleCaptionPanel();
                } else {
                    onDaySelect(day);
                }
            }}
            fixedWeeks
            month={month}
            firstDayOfWeek={1}
            modifiers={modifiers}
            canChangeMonth={false}
            onDayClick={onDaySelect}
            selectedDays={selectedDays}
            numberOfMonths={numberOfMonths}
            localeUtils={MomentLocaleUtils}
            locale='ru'
        />
    );
}
