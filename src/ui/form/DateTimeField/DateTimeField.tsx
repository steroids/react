import {useMemo} from 'react';
import useDateTime from '../DateField/useDateTime';
import {ICalendarProps} from '../../content/Calendar/Calendar';
import useDateInputState, {
    IDateInputStateInput,
    IDateInputStateOutput,
} from '../../form/DateField/useDateInputState';
import fieldWrapper, {IFieldWrapperOutputProps} from '../../form/Field/fieldWrapper';
import {useComponents} from '../../../hooks';

/**
 * DateTimeField
 *
 * Поля ввода с выпадающими списками для выбора даты и времени.
 *
 * Компонент `DateTimeField` предоставляет возможность создания полей ввода для выбора даты и времени с помощью выпадающих списков.
 *  Он объединяет функциональность компонента `DateField` для выбора даты и компонента `TimePanel` для выбора времени.
 */

export interface IDateTimeFieldProps extends IDateInputStateInput, IUiComponent {

    /**
     * Свойства для компонента Calendar
     */
    calendarProps?: ICalendarProps,

    /**
     * Свойства для компонента панели времени
     */
    timePanelViewProps?: any,

    [key: string]: any;
}

export interface IDateTimeFieldViewProps extends IDateInputStateOutput,
    Pick<IDateTimeFieldProps, 'size' | 'errors' | 'showRemove' | 'calendarProps' | 'className' | 'timePanelViewProps'>
{
    [key: string]: any;
}

const DATE_TIME_SEPARATOR = ' ';

/**
 * DateTimeField
 * Поля ввода с выпадающими списками для выбора даты и времени
 */
function DateTimeField(props: IDateTimeFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const {
        onClear,
        onClose,
        isOpened,
        inputProps,
    } = useDateInputState({
        input: props.input,
        disabled: props.disabled,
        onChange: props.onChange,
        required: props.required,
        inputProps: props.inputProps,
        placeholder: props.placeholder,
        valueFormat: props.valueFormat,
        displayFormat: props.displayFormat,
        useUTC: props.useUTC,
        dateInUTC: props.dateInUTC,
    });

    const {
        dateValueFormat,
        dateValue,
        timeValue,
        onDateSelect,
        onTimeSelect,
    } = useDateTime({
        displayFormat: props.displayFormat,
        dateTimeSeparator: DATE_TIME_SEPARATOR,
        input: props.input,
        valueFormat: props.valueFormat,
        useUTC: props.useUTC,
        dateInUTC: props.dateInUTC,
    });

    // Calendar props
    const calendarProps = useMemo(() => ({
        value: dateValue,
        onChange: onDateSelect,
        valueFormat: dateValueFormat,
        ...props.calendarProps,
    }), [dateValue, dateValueFormat, onDateSelect, props.calendarProps]);

    // TimePanel props
    const timePanelViewProps = useMemo(() => ({
        onClose,
        showHeader: true,
        showNow: false,
        value: timeValue,
        onSelect: onTimeSelect,
    }), [onClose, onTimeSelect, timeValue]);

    return components.ui.renderView(props.view || 'form.DateTimeFieldView', {
        ...props.viewProps,
        isOpened,
        onClear,
        onClose,
        inputProps,
        calendarProps,
        timePanelViewProps,
        size: props.size,
        icon: props.icon,
        label: props.label,
        errors: props.errors,
        className: props.className,
        showRemove: props.showRemove,
        isInvalid: props.isInvalid,
        disabled: props.disabled,
        style: props.style,
    });
}

DateTimeField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    displayFormat: 'DD.MM.YYYY' + DATE_TIME_SEPARATOR + 'HH:mm',
    valueFormat: 'YYYY-MM-DD' + DATE_TIME_SEPARATOR + 'HH:mm',
    useUTC: false,
    dateInUTC: false,
    size: 'md',
    icon: true,
};

export default fieldWrapper<IDateTimeFieldProps>('DateTimeField', DateTimeField);
