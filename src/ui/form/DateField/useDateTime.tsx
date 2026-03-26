/* eslint-disable import/no-extraneous-dependencies */
import dayjs from 'dayjs';
import {useCallback, useMemo} from 'react';

import {convertDate} from '../../../utils/calendar';
import {IDateInputStateInput} from '../../form/DateField/useDateInputState';

interface IUseDateTimeProps extends
    Pick<IDateInputStateInput, 'displayFormat' | 'valueFormat' | 'input' | 'useUTC' | 'dateInUTC'>
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
        props.useUTC,
        props.dateInUTC,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [dateValueFormat, props.displayFormat, props.input.value, props.valueFormat]);

    const timeValue = useMemo(() => convertDate(
        props.input.value,
        [props.displayFormat, props.valueFormat],
        timeValueFormat,
        props.useUTC,
        props.dateInUTC,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [props.displayFormat, props.input.value, props.valueFormat, timeValueFormat]);

    // Handler for calendar and time picker changes
    const onDateSelect = useCallback(date => {
        const result = date + props.dateTimeSeparator + (timeValue || '00:00');
        props.input.onChange.call(
            null,
            convertDate(
                result,
                [props.valueFormat, 'YYYY-MM-DD HH:mm'],
                props.valueFormat,
                // converting to UTC here depends on whether the date is stored in UTC
                props.dateInUTC,
                // whether the date provided from onSelect is in UTC or not depends on this flag
                props.useUTC,
            ),
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.dateTimeSeparator, props.input.onChange, props.valueFormat, timeValue]);
    const onTimeSelect = useCallback(time => {
        const result = (dateValue || dayjs().format(dateValueFormat)) + props.dateTimeSeparator + time;

        props.input.onChange.call(
            null,
            convertDate(
                result,
                [props.valueFormat, 'YYYY-MM-DD HH:mm'],
                props.valueFormat,
                // converting to UTC here depends on whether the date is stored in UTC
                props.dateInUTC,
                // whether the date provided from onSelect is in UTC or not depends on this flag
                props.useUTC,
            ),
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
