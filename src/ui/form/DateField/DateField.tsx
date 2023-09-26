import {useMemo} from 'react';
import {MaskitoOptions} from '@maskito/core';
import {useMaskito} from '@maskito/react';
import {maskitoDateOptionsGenerator} from '@maskito/kit';
import {ICalendarProps} from '../../content/Calendar/Calendar';
import {useComponents} from '../../../hooks';
import useDateInputState, {IDateInputStateInput, IDateInputStateOutput} from './useDateInputState';
import fieldWrapper, {
    IFieldWrapperOutputProps,
} from '../../form/Field/fieldWrapper';

/**
 * DateField
 *
 * Поле ввода с выпадающим календарём для выбора даты.
 *
 * Компонент `DateField` предоставляет возможность создания поля ввода с календарём для выбора даты.
 * Он предоставляет пользователю удобный интерфейс для выбора даты с помощью календаря,
 * а также поддерживает настройку формата отображения даты и другие параметры.
 */

export interface IDateFieldProps extends IDateInputStateInput, IUiComponent {
    /**
     * Свойства для view компонента
     */
    viewProps?: Record<string, unknown>,

    /**
     * Свойства для компонента Calendar
     */
    calendarProps?: ICalendarProps,

    /**
     * Опции маски для поля ввода
     */
    maskOptions?: MaskitoOptions,

    [key: string]: any,
}

export interface IDateFieldViewProps extends IDateInputStateOutput,
    Pick<IDateFieldProps, 'size' | 'icon' | 'errors' | 'showRemove' | 'className' | 'calendarProps'> {

    /**
     * Ref для input элемента, который накладывает маску
     */
    maskInputRef?: React.RefCallback<HTMLElement>,

    [key: string]: any,
}

/**
 * DateField
 * Поле ввода с выпадающим календарём для выбора даты
 */
function DateField(props: IDateFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const maskInputRef = useMaskito({options: props.maskOptions});

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
        style: props.style,
        maskInputRef,
    });
}

DateField.defaultProps = {
    disabled: false,
    displayFormat: 'DD.MM.YYYY',
    icon: true,
    required: false,
    showRemove: true,
    valueFormat: 'YYYY-MM-DD',
    maskOptions: maskitoDateOptionsGenerator({mode: 'dd/mm/yyyy', separator: '.'}),
    size: 'md',
};

export default fieldWrapper<IDateFieldProps>('DateField', DateField);
