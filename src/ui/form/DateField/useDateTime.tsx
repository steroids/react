import {useCallback, useMemo} from 'react';
import moment from 'moment';
import {convertDate} from '../../../utils/calendar';
import {IDateInputStateInput} from '../../form/DateField/useDateInputState';

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

    const dateValue = useMemo(() => convertDate(
        props.input.value,
        [props.valueFormat, props.displayFormat],
        dateValueFormat,
        false,
        true,
    ), [dateValueFormat, props.displayFormat, props.input.value, props.valueFormat]);

    const timeValue = useMemo(() => convertDate(
        props.input.value,
        [props.displayFormat, props.valueFormat],
        timeValueFormat,
        false,
        true,
    ), [props.displayFormat, props.input.value, props.valueFormat, timeValueFormat]);

    // Handler for calendar and time picker changes
    const onDateSelect = useCallback(date => {
        const result = date + props.dateTimeSeparator + (timeValue || '00:00');
        props.input.onChange.call(
            null,
            convertDate(result, [props.valueFormat, 'YYYY-MM-DD HH:mm'], props.valueFormat, true),
        );
    }, [props.dateTimeSeparator, props.input.onChange, props.valueFormat, timeValue]);
    const onTimeSelect = useCallback(time => {
        const result = (dateValue || moment().format(dateValueFormat)) + props.dateTimeSeparator + time;
        props.input.onChange.call(
            null,
            convertDate(result, [props.valueFormat, 'YYYY-MM-DD HH:mm'], props.valueFormat, true),
        );
    }, [dateValue, dateValueFormat, props.dateTimeSeparator, props.input.onChange, props.valueFormat]);

    return {
        dateValue,
        timeValue,
        onDateSelect,
        onTimeSelect,
        dateValueFormat,
        timeValueFormat,
    };
}
