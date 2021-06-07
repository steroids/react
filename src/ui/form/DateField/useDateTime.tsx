import {useCallback} from 'react';
import moment from 'moment';
import {convertDate} from '@steroidsjs/core/utils/calendar';
import {IDateInputStateInput} from '@steroidsjs/core/ui/form/DateField/useDateInputState';

interface IUseDateTimeProps extends
    Pick<IDateInputStateInput, 'displayFormat' | 'valueFormat' | 'input'>
{
    dateTimeSeparator: string,
}

/**
 * useDateTime
 * Хук работает с полем, где используется значение даты и времени.
 * Возвращает значения и обработчики для передачи в Calendar и TimePanel
 */
export default function useDateTime(props:IUseDateTimeProps) {
    const [dateValueFormat, timeValueFormat] = props.valueFormat.split(props.dateTimeSeparator);
    const dateValue = convertDate(
        props.input.value,
        [props.valueFormat, props.displayFormat],
        dateValueFormat,
    );
    const timeValue = convertDate(
        props.input.value,
        [props.valueFormat, props.displayFormat],
        timeValueFormat,
    );

    // Handler for calendar and time picker changes
    const onDateSelect = useCallback(date => {
        props.input.onChange.call(null, date + props.dateTimeSeparator + (timeValue || '00:00'));
    }, [props.dateTimeSeparator, props.input.onChange, timeValue]);
    const onTimeSelect = useCallback(time => {
        props.input.onChange.call(null, (
            dateValue || moment().format(dateValueFormat)) + props.dateTimeSeparator + time);
    }, [dateValue, dateValueFormat, props.dateTimeSeparator, props.input.onChange]);

    return {
        dateValue,
        timeValue,
        onDateSelect,
        onTimeSelect,
        dateValueFormat,
        timeValueFormat,
    };
}
