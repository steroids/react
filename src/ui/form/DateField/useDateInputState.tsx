import {useCallback, useMemo, useState} from 'react';
import {useUpdateEffect} from 'react-use';
import moment from 'moment';
import {convertDate} from '../../../utils/calendar';
import {IFieldWrapperInputProps} from '../../form/Field/fieldWrapper';

export interface IDateInputStateInput extends IFieldWrapperInputProps {

    /**
     * Формат даты показываемый пользователю
     * @example DD.MM.YYYY
     */
    displayFormat?: string;

    /**
     * Иконка, отображаемая в правой части поля
     * @example calendar-day
     */
    icon?: string | boolean;

    /**
     * Свойства поля props.input
     */
    input?: {
        name?: string,
        value?: any,
        onChange: (value: any) => void,
    },

    /**
     * Свойства, передаваемые для поля во view
     */
    inputProps?: Record<string, unknown>,

    /**
     * Дополнительная функция, срабатывающая при изменении props.input
     */
    onChange?: (...args: any[]) => any;

    /**
     * Показывать при наведении на поле иконку для сброса значения поля в начальное состояние
     */
    showRemove?: boolean,

    /**
     * Формат даты отправляемый на сервер
     * @example YYYY-MM-DD
     */
    valueFormat?: string;

    /**
     * Приводить значение даты к часовому поясу UTC
     * (пример: с бэкенда приходит дата в какой-либо временной зоне (не UTC), но нужно отбразить ее
     * в часовом поясе UTC. В этом случае dateInUTC = false, а useUTC = true)
     */
    useUTC?: boolean;

    /**
     * Задано ли значение даты в часовом поясе UTC
     * (пример: с бэкенда приходит дата в UTC, но нужно отбразить ее в локальном времени.
     * В этом случае dateInUTC = true, а useUTC = false)
     */
    dateInUTC?: boolean;
}

export interface IDateInputStateOutput {

    /**
     * Показать или скрыть выпадающую панель
     */
    isOpened?: boolean,

    /**
     * Функция закрывает выпадающую панель
     */
    onClose?: () => void,

    /**
     * Функция очищает значение поля
     */
    onClear?: () => void,

    /**
     * Функция возвращает текущее значение времени (дата + время)
     */
    onNow?: () => void,

    /**
     * Свойства для поля во view
     */
    inputProps: {
        name?: string,
        value?: any,
        onChange: (value: any) => void,
        [key: string]: any,
    },
}

export default function useDateInputState(props: IDateInputStateInput): IDateInputStateOutput {
    // Get props value
    const propsDisplayValue = useMemo(
        () => convertDate(
            props.input.value,
            [
                props.valueFormat,
                props.displayFormat,
            ],
            props.displayFormat,
            props.useUTC,
            props.dateInUTC,
        ) || '',
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const onDisplayValueChange = useCallback((value: any) => {
        value = value.replace(/[^0-9:. ]/g, '');

        setDisplayValue(value);
        let newValue = value;

        if (value !== null) {
            const parsedValue = convertDate(
                value,
                props.displayFormat,
                props.valueFormat,
                props.useUTC,
                props.dateInUTC,
            );
            newValue = parsedValue || !value ? parsedValue : false;
        }

        if (newValue !== false && newValue !== props.input.value) {
            props.input.onChange.call(null, newValue);
            if (props.onChange) {
                props.onChange.call(null, value);
            }
        }
        // eslint-disable-next-line max-len
    }, [props.displayFormat, props.input.onChange, props.input.value, props.onChange, props.valueFormat, props.useUTC, props.dateInUTC]);

    // Dropdown opened state
    const [isOpened, setIsOpened] = useState(false);

    // Focus/blur handlers
    const onFocus = useCallback(e => {
        e.preventDefault();
        setIsOpened(true);
    }, [setIsOpened]);

    const onBlur = useCallback(() => {
        if (propsDisplayValue !== displayValue) {
            setDisplayValue(propsDisplayValue);
        }
    }, [displayValue, propsDisplayValue]);

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
        placeholder: props.placeholder || props.displayFormat.toLowerCase(),
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
