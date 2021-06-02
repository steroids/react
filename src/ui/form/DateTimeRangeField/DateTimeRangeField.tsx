import {useCallback, useMemo} from 'react';
import moment from 'moment';
import useDateAndTime, {IDateAndTimeOutput} from '@steroidsjs/core/ui/form/DateField/useDateAndTime';
import {convertDate} from '@steroidsjs/core/utils/calendar';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../../form/Field/fieldWrapper';
import {useComponents} from '../../../hooks';

/**
 * DateTimeField
 * Поля ввода с выпадающими списками для выбора даты и времени
 */
export interface IDateTimeRangeFieldProps extends IFieldWrapperInputProps {

    /**
     * Формат показываемый пользователю
     * @example DD.MM.YYYY HH:mm
     */
    displayFormat?: string;

    /**
     * Формат отправляемый на сервер
     * @example YYYY-MM-DD HH:mm
     */
    valueFormat?: string;

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: any;

    /**
     * Дополнительный CSS-класс
     */
    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;

    [key: string]: any;
}

export interface IDateTimeRangeFieldViewProps extends IDateAndTimeOutput {
    dateValue: any,
    timeValue: any,
    onDateSelect: any,
    onTimeSelect: any,
    calendarProps: {
        value: string,
        valueFormat: string,
        onChange: (value: string) => void,
    },
}

const DATE_TIME_SEPARATOR = ' ';

function DateTimeRangeField(props: IDateTimeRangeFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const {
        isOpened,
        onClose,
        inputProps,
        onClear,
        onNow,
    } = useDateAndTime({
        displayFormat: props.displayFormat,
        valueFormat: props.valueFormat,
        input: props.input,
        onChange: props.onChange,
        disabled: props.disabled,
        placeholder: props.placeholder,
        required: props.required,
        inputProps: props.inputProps,
    });

    // Separate date and time values
    const [dateValueFormat, timeValueFormat] = props.valueFormat.split(DATE_TIME_SEPARATOR);
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
        props.input.onChange.call(null, date + DATE_TIME_SEPARATOR + (timeValue || '00:00'));
    }, [props.input.onChange, timeValue]);
    const onTimeSelect = useCallback(time => {
        props.input.onChange.call(null, (dateValue || moment().format(dateValueFormat)) + DATE_TIME_SEPARATOR + time);
    }, [dateValue, dateValueFormat, props.input.onChange]);

    // Calendar props
    const calendarProps = useMemo(() => ({
        value: dateValue,
        onChange: onDateSelect,
        valueFormat: dateValueFormat,
    }), [dateValue, dateValueFormat, onDateSelect]);

    return components.ui.renderView(props.view || 'form.DateTimeRangeFieldView', {
        ...props.viewProps,
        isOpened,
        onClose,
        inputProps,
        onClear,
        onNow,
        timeValue,
        onTimeSelect,
        calendarProps,
        size: props.size,
        icon: props.icon,
        errors: props.errors,
        showRemove: props.showRemove,
        className: props.className,
    });
}

DateTimeRangeField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    displayFormat: 'DD.MM.YYYY' + DATE_TIME_SEPARATOR + 'HH:mm',
    valueFormat: 'YYYY-MM-DD' + DATE_TIME_SEPARATOR + 'HH:mm',
};

export default fieldWrapper('DateTimeRangeField', DateTimeRangeField);
