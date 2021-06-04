import {useCallback} from 'react';
import moment from 'moment';
import {convertDate} from '@steroidsjs/core/utils/calendar';

interface IUseDateTimeProps {
    valueFormat: string,
    displayFormat: string,
    DATE_TIME_SEPARATOR: string,
    input: {
        name?: string,
        value?: any,
        onChange: (value: any) => void,
    },
}

/**
 * useDateTime
 * Хук работает с полем, где используется значение даты и времени.
 * Возвращает значения и обработчики для передачи в Calendar и TimePanel
 */
export default function useDateTime(props:IUseDateTimeProps) {
    const [dateValueFormat, timeValueFormat] = props.valueFormat.split(props.DATE_TIME_SEPARATOR);
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

    // Handler for 'from' calendar and time picker changes
    const onDateSelect = useCallback(date => {
        props.input.onChange.call(null, date + props.DATE_TIME_SEPARATOR + (timeValue || '00:00'));
    }, [props.DATE_TIME_SEPARATOR, props.input.onChange, timeValue]);
    const onTimeSelect = useCallback(time => {
        props.input.onChange.call(null, (
            dateValue || moment().format(dateValueFormat)) + props.DATE_TIME_SEPARATOR + time);
    }, [dateValue, dateValueFormat, props.DATE_TIME_SEPARATOR, props.input.onChange]);

    return {
        dateValue,
        timeValue,
        onDateSelect,
        onTimeSelect,
        dateValueFormat,
        timeValueFormat,
    };
}
