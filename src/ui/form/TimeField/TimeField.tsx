import * as React from 'react';
import {useCallback, useMemo, useRef, useState} from 'react';
import {useClickAway} from 'react-use';
import moment from 'moment';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';

/**
 * TimeField
 * Поле для выбора времени
 */
export interface ITimeFieldProps extends IFieldWrapperInputProps {

    /**
     * Включить возможность сброса значения
     * @example 'true'
     */
    showRemove?: boolean,

    /**
     * Отключить border вокруг элемента
     * @example 'true'
     */
    noBorder?: boolean,

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

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: any;

    /**
     * Дополнительный CSS-класс для элемента отображения
     */
    className?: CssClassName;

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: any;

    [key: string]: any;
}

export interface ITimeFieldViewProps extends ITimeFieldProps, IFieldWrapperOutputProps {
    forwardedRef: any,
    style?: any,
    isInvalid?: boolean,
    placeholder?: string,
    type: any,
    inputProps: {
        type: string,
        name: string,
        onChange: (value: string) => void,
        value: string | number,
        placeholder: string,
        disabled: string,
    },
    showDropDown: boolean,
    openDropDown: () => void,
    onBlur: () => void,
    clearInput: () => void,
    setNow: () => void,
    errors?: any,
}

function TimeField(props: ITimeFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const [hours, setHours] = useState<string>(null);
    const [minutes, setMinutes] = useState<string>(null);
    const [innerInput, setInnerInput] = useState<string>(null);
    const [showDropDown, setShowDropDown] = useState<boolean>(false);

    const calculatedValue = useCallback((newTime, part = '') => {
        let inputValue = props.input.value ? props.input.value.split(':') : '';
        if (part === 'HOUR') {
            inputValue = `${newTime}:${inputValue[1] || '00'}`;
        } else if (part === 'MIN') {
            inputValue = `${inputValue[0] || '00'}:${newTime}`;
        }
        setInnerInput(inputValue);
        return inputValue;
    }, [props.input.value]);

    const changeHours = useCallback((newHour) => {
        if (newHour !== hours) {
            setHours(newHour);
            props.input.onChange.call(null, calculatedValue(newHour, 'HOUR'));
        }
    }, [calculatedValue, hours, props.input.onChange]);

    const changeMinutes = useCallback((newMinute) => {
        if (newMinute !== minutes) {
            setMinutes(newMinute);
            props.input.onChange.call(null, calculatedValue(newMinute, 'MIN'));
        }
    }, [calculatedValue, minutes, props.input.onChange]);

    const onChange = useCallback((value) => {
        setInnerInput(value);
        const matchedValue = value.match(/(\d{2}):(\d{2})/);
        if (matchedValue?.length > 0) {
            const newHours = matchedValue[1];
            const newMinutes = matchedValue[2];
            const isHourChanged = newHours !== hours && newHours <= 23;
            const isMinutesChanged = newMinutes !== minutes && newMinutes <= 59;
            if (isHourChanged && isMinutesChanged) {
                setHours(newHours);
                setMinutes(newMinutes);
                props.input.onChange.call(null, value);
            } else {
                if (isHourChanged) {
                    changeHours(newHours);
                }
                if (isMinutesChanged) {
                    changeMinutes(newMinutes);
                }
            }
        }
    }, [changeHours, changeMinutes, hours, minutes, props.input.onChange]);

    const setNow = useCallback(() => {
        const timeNow = moment().format('hh:mm');
        onChange.call(null, timeNow);
    }, [onChange]);

    const clearInput = useCallback(() => {
        setInnerInput(null);
        setHours(null);
        setMinutes(null);
        setShowDropDown(false);
        props.input.onChange.call(null, null);
    }, [props.input.onChange]);

    const onBlur = useCallback(() => {
        if (props.input.value !== innerInput) {
            setInnerInput(props.input.value);
        }
    }, [innerInput, props.input.value]);

    const openDropDown = useCallback(() => {
        if (!showDropDown) {
            setShowDropDown(true);
        }
    }, [showDropDown]);

    const closeDropDown = useCallback(() => {
        if (showDropDown) {
            setShowDropDown(false);
        }
    }, [showDropDown]);

    // Outside click -> close
    const forwardedRef = useRef(null);
    useClickAway(forwardedRef, closeDropDown);

    const inputProps = useMemo(() => ({
        type: props.type,
        name: props.input.name,
        placeholder: props.placeholder,
        disabled: props.disabled,
        ...props.inputProps,
        value: innerInput || '',
        onChange,
    }), [innerInput, onChange, props.disabled, props.input.name, props.inputProps, props.placeholder, props.type]);

    return components.ui.renderView(props.view || 'form.TimeFieldView', {
        ...props,
        forwardedRef,
        inputProps,
        changeHours,
        changeMinutes,
        showDropDown,
        openDropDown,
        onBlur,
        clearInput,
        setNow,
    });
}

TimeField.defaultProps = {
    disabled: false,
    required: false,
    noBorder: false,
    showRemove: true,
    placeholder: 'Select time',
    type: 'text',
};

export default fieldWrapper('TimeField', TimeField);
