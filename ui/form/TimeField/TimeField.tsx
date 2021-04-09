import * as React from 'react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useClickAway, usePrevious} from 'react-use';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';

/**
 * InputField
 * Поле ввода текста
 */
export interface ITimeFieldProps extends IFieldWrapperInputProps {
    /**
     * Placeholder подсказка
     * @example Your text...
     */
    placeholder?: string;

    /**
     * Свойства для элемента \<input /\>
     * @example {onKeyDown: ...}
     */
    inputProps?: any;
    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизациии отображения
     * @example MyCustomView
     */
    view?: any;

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: any;

    /**
     * Формат отображения времени
     * @example 'HH:mm'
     */
    timeFormat?: string,

    /**
     * Объект, который будет передан в props внутреннего компонента используемого для выбора времени.
     */
    pickerProps?: any;

    [key: string]: any;
}

export interface ITimeFieldViewProps extends ITimeFieldProps, IFieldWrapperOutputProps {
    style?: any,
    isInvalid?: boolean,
    errors?: any,
    placeholder?: string,
    timeFormat?: string,
    inputProps: {
        type: string,
        name: string,
        onChange: (value: string) => void,
        value: string | number,
        placeholder: string,
        disabled: string,
    },
    pickerProps: any,
    type: any,
    showDropDown: boolean,
    openDropDown: () => void,
    forwardedRef: any,
}

function TimeField(props: ITimeFieldProps & IFieldWrapperOutputProps) {
    const components = useComponents();

    const [hours, setHours] = useState<string>(null);
    const [minutes, setMinutes] = useState<string>(null);
    const [showDropDown, setShowDropDown] = useState<boolean>(false);

    const onChange = useCallback((value) => {
        props.input.onChange.call(null, value);
        if (props.onChange) {
            props.onChange.call(null, value);
        }
    }, [props.input.onChange, props.onChange]);

    const changeHours = useCallback((value) => {
        setHours(value);
    }, []);

    const changeMinutes = useCallback((value) => {
        setMinutes(value);
    }, []);

    const openDropDown = useCallback(() => {
        setShowDropDown(true);
    }, []);

    const closeDropDown = useCallback(() => {
        setShowDropDown(false);
    }, []);

    // Outside click -> close
    const forwardedRef = useRef(null);
    useClickAway(forwardedRef, closeDropDown);

    const calculatedValue = useCallback(() => {
        let newValue = props.input.value ? props.input.value.split(':') : '';
        if (hours || minutes) {
            newValue = `${hours || newValue[0] || '00'}:${minutes || newValue[1] || '00'}`;
        } else if (newValue) {
            newValue = newValue.join(':');
        }
        return newValue;
    }, [hours, minutes, props.input.value]);

    const previousCalculatedValue = usePrevious(calculatedValue());
    useEffect(() => {
        const newValue = calculatedValue();
        if (previousCalculatedValue !== newValue) {
            props.input.onChange.call(null, newValue);
        }
    }, [calculatedValue, previousCalculatedValue, props.input.onChange, props.input.value]);

    const inputProps = useMemo(() => ({
        type: props.type,
        name: props.input.name,
        placeholder: props.placeholder,
        disabled: props.disabled,
        ...props.inputProps,
        value: props.input.value || '',
        onChange,
    }), [onChange, props.disabled, props.input.name, props.input.value, props.inputProps, props.placeholder,
        props.type]);

    return components.ui.renderView(props.view || 'form.TimeFieldView', {
        ...props,
        forwardedRef,
        inputProps,
        changeHours,
        changeMinutes,
        showDropDown,
        openDropDown,
    });
}

TimeField.defaultProps = {
    disabled: false,
    required: false,
    timeFormat: 'HH:mm',
    placeholder: 'Select time',
    type: 'text',
};

export default fieldWrapper('TimeField', TimeField);
