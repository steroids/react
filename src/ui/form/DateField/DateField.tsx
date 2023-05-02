import {useMemo} from 'react';
import {ICalendarProps} from '../../content/Calendar/Calendar';
import {useComponents} from '../../../hooks';
import useDateInputState, {IDateInputStateInput, IDateInputStateOutput} from './useDateInputState';
import fieldWrapper, {
    IFieldWrapperOutputProps,
} from '../../form/Field/fieldWrapper';

export interface IDateFieldProps extends IDateInputStateInput {
    /**
     * Дополнительный CSS-класс для элемента отображения
     */
    className?: CssClassName,

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: CustomStyle,

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView,

    /**
     * Свойства для view компонента
     */
    viewProps?: Record<string, unknown>,

    /**
     * Свойства для компонента Calendar
     */
    calendarProps?: ICalendarProps,

    [key: string]: any,
}

export interface IDateFieldViewProps extends IDateInputStateOutput,
    Pick<IDateFieldProps, 'size' | 'icon' | 'errors' | 'showRemove' | 'className' | 'calendarProps'>
{
    [key: string]: any,
}

/**
 * DateField
 * Поле ввода с выпадающим календарём для выбора даты
 */
function DateField(props: IDateFieldProps & IFieldWrapperOutputProps): JSX.Element {
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
    });

    // Calendar props
    const calendarProps: ICalendarProps = useMemo(() => ({
        value: props.input.value,
        onChange: props.input.onChange,
        valueFormat: props.valueFormat,
        ...props.calendarProps,
    }), [props.calendarProps, props.input.onChange, props.input.value, props.valueFormat]);

    return components.ui.renderView(props.view || 'form.DateFieldView', {
        ...props.viewProps,
        onClear,
        onClose,
        isOpened,
        inputProps,
        calendarProps,
        size: props.size,
        icon: props.icon,
        errors: props.errors,
        label: props.label,
        disabled: props.disabled,
        className: props.className,
        showRemove: props.showRemove,
    });
}

DateField.defaultProps = {
    disabled: false,
    displayFormat: 'DD.MM.YYYY',
    icon: true,
    required: false,
    showRemove: true,
    valueFormat: 'YYYY-MM-DD',
    size: 'md',
};

export default fieldWrapper<IDateFieldProps>('DateField', DateField);
