import {useMemo} from 'react';
import useDateTime from '../DateField/useDateTime';
import {ICalendarProps} from '../../content/Calendar/Calendar';
import useDateInputState, {
    IDateInputStateInput,
    IDateInputStateOutput,
} from '../../form/DateField/useDateInputState';
import fieldWrapper, {IFieldWrapperOutputProps} from '../../form/Field/fieldWrapper';
import {useComponents} from '../../../hooks';

export interface IDateTimeFieldProps extends IDateInputStateInput {
    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: any,

    /**
     * Дополнительный CSS-класс
     */
    className?: CssClassName,

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView,

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
    });

    console.log("DATETIME INPUT", inputProps);

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
    });

    // Calendar props
    const calendarProps = useMemo(() => ({
        value: dateValue,
        onChange: onDateSelect,
        valueFormat: dateValueFormat,
    }), [dateValue, dateValueFormat, onDateSelect]);

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
    });
}

DateTimeField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    displayFormat: 'DD.MM.YYYY' + DATE_TIME_SEPARATOR + 'HH:mm',
    valueFormat: 'YYYY-MM-DD' + DATE_TIME_SEPARATOR + 'HH:mm',
    useUTC: true,
};

export default fieldWrapper<IDateTimeFieldProps>('DateTimeField', DateTimeField);
