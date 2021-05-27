import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {usePrevious} from 'react-use';
import useInitial from '@steroidsjs/core/hooks/useInitial';
import useDateAndTime, {IDateAndTimeOutput} from '../DateField/useDateAndTime';
import {useComponents} from '../../../hooks';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../../form/Field/fieldWrapper';

/**
 * DateRangeField
 * Поле ввода дипазона двух дат с выпадающим календарём
 */
export interface IDateRangeFieldProps extends Omit<IFieldWrapperInputProps, 'attribute'> {
    /**
     * Аттрибут (название) поля в форме
     * @example 'fromTime'
     */
    attributeFrom?: string;

    /**
     * Аттрибут (название) поля в форме
     * @example 'toTime'
     */
    attributeTo?: string;

    /**
     * Свойства для компонента DayPickerInput
     * @example {dayPickerProps: {showWeekNumbers: true}}
     */
    pickerProps?: any;

    /**
     * Формат даты показываемый пользователю
     * @example DD.MM.YYYY
     */
    displayFormat?: string;

    /**
     * Формат даты отправляемый на сервер
     * @example YYYY-MM-DD
     */
    valueFormat?: string;

    /**
     * Дополнительный CSS-класс
     */
    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;

    /**
     * Placeholder подсказка
     * @example Your text...
     */
    placeholder?: any;

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: any;

    /**
     * Иконка
     * @example calendar-day
     */
    icon?: boolean | string;

    /**
     * Отображение кнопки для сброса значения поля
     * @example true
     */
    showRemove?: boolean,

    inputPropsFrom?: any,

    inputPropsTo?: any,

    [key: string]: any;
}

export interface IDateRangeFieldViewProps extends IFieldWrapperOutputProps, IDateRangeFieldProps, IDateAndTimeOutput {
    inputPropsFrom?: any,
    inputPropsTo?: any,
}

interface IDateRangeFieldPrivateProps extends IDateRangeFieldProps, Omit<IFieldWrapperOutputProps, 'input' | 'errors'> {
    inputFrom?: {
        name?: string,
        value?: any,
        onChange: (value: any) => void,
    },
    inputTo?: {
        name?: string,
        value?: any,
        onChange: (value: any) => void,
    },
    errorsFrom?: string[],
    errorsTo?: string[],
}

function DateRangeField(props: IDateRangeFieldPrivateProps) {
    const components = useComponents();

    // Global onChange (from props)
    const onChange = useCallback(() => {
        props.onChange.call(null, {
            [props.attributeFrom]: props.inputFrom.value,
            [props.attributeTo]: props.inputTo.value,
        });
    }, [props.attributeFrom, props.attributeTo, props.inputFrom.value, props.inputTo.value, props.onChange]);

    // Input 'from'
    const {
        isOpened: isOpenedFrom,
        onClose: onCloseFrom,
        inputProps: inputPropsFrom,
        onClear: onClearFrom,
    } = useDateAndTime({
        displayFormat: props.displayFormat,
        valueFormat: props.valueFormat,
        input: props.inputFrom,
        disabled: props.disabled,
        placeholder: props.placeholder,
        required: props.required,
        inputProps: props.inputPropsFrom,
        onChange,
    });

    // Input 'to'
    const {
        isOpened: isOpenedTo,
        onClose: onCloseTo,
        inputProps: inputPropsTo,
        onClear: onClearTo,
    } = useDateAndTime({
        displayFormat: props.displayFormat,
        valueFormat: props.valueFormat,
        input: props.inputTo,
        disabled: props.disabled,
        placeholder: props.placeholder,
        required: props.required,
        inputProps: props.inputPropsTo,
        onChange,
    });

    // State for current edited input
    const [focus, setFocus] = useState('from');

    // Custom onFocus
    const inputFromRef = useRef(null);
    const onFocusFrom = useCallback(e => {
        inputPropsFrom.onFocus.call(null, e);
        setFocus('from');
    }, [inputPropsFrom.onFocus]);
    const extendedInputPropsFrom = useMemo(() => ({
        ...inputPropsFrom,
        onFocus: onFocusFrom,
        ref: inputFromRef,
    }), [inputPropsFrom, onFocusFrom]);

    const inputToRef = useRef(null);
    const onFocusTo = useCallback(e => {
        inputPropsTo.onFocus.call(null, e);
        setFocus('to');
    }, [inputPropsTo.onFocus]);
    const extendedInputPropsTo = useMemo(() => ({
        ...inputPropsTo,
        onFocus: onFocusTo,
        ref: inputToRef,
    }), [inputPropsTo, onFocusTo]);

    // Calendar props
    const calendarProps = useMemo(() => ({
        value: [props.inputFrom.value, props.inputTo.value],
        onChange: focus === 'from' ? props.inputFrom.onChange : props.inputTo.onChange,
        valueFormat: props.valueFormat,
    }), [focus, props.inputFrom.onChange, props.inputFrom.value, props.inputTo.onChange,
        props.inputTo.value, props.valueFormat]);

    // Close handler
    const onClose = useCallback(() => {
        if (focus === 'from') {
            onCloseFrom();
        } else {
            onCloseTo();
        }
    }, [focus, onCloseFrom, onCloseTo]);

    // Clear handler
    const onClear = useCallback(() => {
        onClearFrom();
        onClearTo();
    }, [onClearFrom, onClearTo]);

    return components.ui.renderView(props.view || 'form.DateRangeFieldView', {
        ...props.viewProps,
        isOpened: focus === 'from' ? isOpenedFrom : isOpenedTo,
        onClose,
        onClear,
        inputPropsFrom: extendedInputPropsFrom,
        inputPropsTo: extendedInputPropsTo,
        errorsFrom: props.errorsFrom,
        errorsTo: props.errorsTo,
        calendarProps,
        size: props.size,
        icon: props.icon,
        showRemove: props.showRemove,
        className: props.className,
    });
}

DateRangeField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    displayFormat: 'DD.MM.YYYY',
    valueFormat: 'YYYY-MM-DD',
    showRemove: true,
    icon: true,
};

export default fieldWrapper('DateRangeField', DateRangeField, {attributeSuffixes: ['from', 'to']});
