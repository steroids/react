import {useCallback} from 'react';
import moment from 'moment';
import {convertDate} from '@steroidsjs/core/utils/calendar';

interface IUseDateRangeProps {
    valueFormat: string,
    displayFormat: string,
    DATE_TIME_SEPARATOR: string,
    inputFrom: {
        name?: string,
        value?: any,
        onChange: (value: any) => void,
    },
    inputTo: {
        name?: string,
        value?: any,
        onChange: (value: any) => void,
    },
}

export default function useDateRange(props:IUseDateRangeProps) {
    const {
        DATE_TIME_SEPARATOR,
        valueFormat,
        inputFrom,
        inputTo,
    } = props;

    // Separate 'from' date and time values
    const [dateValueFormat, timeValueFormat] = valueFormat.split(DATE_TIME_SEPARATOR);
    const dateValueFrom = convertDate(
        inputFrom.value,
        [props.valueFormat, props.displayFormat],
        dateValueFormat,
    );
    const timeValueFrom = convertDate(
        props.inputFrom.value,
        [props.valueFormat, props.displayFormat],
        timeValueFormat,
    );
    // Separate 'to' date and time values
    const dateValueTo = convertDate(
        inputTo.value,
        [props.valueFormat, props.displayFormat],
        dateValueFormat,
    );
    const timeValueTo = convertDate(
        inputTo.value,
        [props.valueFormat, props.displayFormat],
        timeValueFormat,
    );

    // Handler for 'from' calendar and time picker changes
    const onDateFromSelect = useCallback(date => {
        props.inputFrom.onChange.call(null, date + DATE_TIME_SEPARATOR + (timeValueFrom || '00:00'));
    }, [DATE_TIME_SEPARATOR, props.inputFrom.onChange, timeValueFrom]);
    const onTimeFromSelect = useCallback(time => {
        props.inputFrom.onChange.call(null, (
            dateValueFrom || moment().format(dateValueFormat)) + DATE_TIME_SEPARATOR + time);
    }, [DATE_TIME_SEPARATOR, dateValueFormat, dateValueFrom, props.inputFrom.onChange]);

    // Handler for 'to' calendar and time picker changes
    const onDateToSelect = useCallback(date => {
        props.inputTo.onChange.call(null, date + DATE_TIME_SEPARATOR + (timeValueTo || '00:00'));
    }, [DATE_TIME_SEPARATOR, props.inputTo.onChange, timeValueTo]);
    const onTimeToSelect = useCallback(time => {
        props.inputTo.onChange.call(null, (
            dateValueTo || moment().format(dateValueFormat)) + DATE_TIME_SEPARATOR + time);
    }, [DATE_TIME_SEPARATOR, dateValueFormat, dateValueTo, props.inputTo.onChange]);

    return {
        dateValueFormat,
        timeValueFormat,
        dateValueTo,
        dateValueFrom,
        timeValueTo,
        timeValueFrom,
        onDateFromSelect,
        onTimeFromSelect,
        onDateToSelect,
        onTimeToSelect,
    };
}
