import {useCallback, useMemo, useState} from 'react';
import {convertDate} from '@steroidsjs/core/utils/calendar';
import {useUpdateEffect} from 'react-use';
import moment from 'moment';

interface IDateAndTimeInput {

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
     * Переводит элемент в состояние "не активен"
     * @example true
     */
    disabled?: boolean;

    /**
     * Обязательное ли поле? Если true, то к названию будет добавлен
     * модификатор 'required' - красная звездочка (по умолчанию)
     * @example true
     */
    required?: boolean;

    /**
     * Placeholder подсказка
     * @example Your text...
     */
    placeholder?: any;

    inputProps?: Record<string, unknown>,

    input?: {
        name?: string,
        value?: any,
        onChange: (value: any) => void,
    },

    onChange?: (...args: any[]) => any;
}

export interface IDateAndTimeOutput {
    isOpened: boolean,
    onClose: () => void,
    onClear: () => void,

    /**
     * Функция возвращает текущее значение времени (дата + время)
     */
    onNow: () => void,
    inputProps: {
        name?: string,
        value?: any,
        onChange: (value: any) => void,
        [key:string]: any,
    },
}

export default function useDateAndTime(props: IDateAndTimeInput): IDateAndTimeOutput {
    // Get props value
    const propsDisplayValue = useMemo(
        () => convertDate(
            props.input.value,
            [
                props.valueFormat,
                props.displayFormat,
            ],
            props.displayFormat,
        ) || '',
        [props.displayFormat, props.input.value, props.valueFormat],
    );

    // Display value state
    const [displayValue, setDisplayValue] = useState(propsDisplayValue);

    // Update display value on update props input value
    useUpdateEffect(() => {
        if (displayValue !== propsDisplayValue) {
            setDisplayValue(propsDisplayValue);
            if (props.onChange) {
                props.onChange.call(null, propsDisplayValue);
            }
        }
        // Subscribe on props value changed
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propsDisplayValue]);

    // Display input change handler
    const onDisplayValueChange = useCallback(value => {
        setDisplayValue(value);

        const parsedValue = convertDate(value, props.displayFormat, props.valueFormat);
        const newValue = parsedValue || !value ? parsedValue || null : false;
        if (newValue !== false && newValue !== props.input.value) {
            props.input.onChange.call(null, newValue);
            if (props.onChange) {
                props.onChange.call(null, newValue);
            }
        }
    }, [props.displayFormat, props.input.onChange, props.input.value, props.onChange, props.valueFormat]);

    // Dropdown opened state
    const [isOpened, setIsOpened] = useState(false);

    // Focus/blur handlers
    const onFocus = useCallback(e => {
        e.preventDefault();
        setIsOpened(true);
    }, [setIsOpened]);
    const onBlur = useCallback(e => {
        e.preventDefault();
        //setIsOpened(false);
    }, []);
    const onClose = useCallback(() => {
        setIsOpened(false);

        if (propsDisplayValue !== displayValue) {
            setDisplayValue(propsDisplayValue);
        }
    }, [displayValue, propsDisplayValue]);

    const onClear = useCallback(() => {
        onDisplayValueChange('');
    }, [onDisplayValueChange]);

    const onNow = useCallback(() => {
        onDisplayValueChange(moment().format(props.displayFormat));
    }, [onDisplayValueChange, props.displayFormat]);

    // Display input props
    const inputProps = useMemo(() => ({
        value: displayValue,
        onChange: onDisplayValueChange,
        onFocus,
        onBlur,
        disabled: props.disabled,
        placeholder: props.placeholder || props.displayFormat,
        required: props.required,
        name: props.input.name,
        autoComplete: 'off',
        type: 'text',
        ...props.inputProps,
    }), [displayValue, onBlur, onDisplayValueChange, onFocus, props.disabled, props.displayFormat,
        props.input.name, props.inputProps, props.placeholder, props.required]);

    return {
        isOpened,
        inputProps,
        onClear,
        onClose,
        onNow,
    };
}
