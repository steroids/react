import * as React from 'react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import useDateAndTime, {IDateAndTimeOutput} from './useDateAndTime';
import {useComponents} from '../../../hooks';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../../form/Field/fieldWrapper';

/**
 * DateField
 * Поле ввода с выпадающим календарём для выбора даты
 */
export interface IDateFieldProps extends IFieldWrapperInputProps {
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

    showRemove?: boolean,

    [key: string]: any;
}

export interface IDateFieldViewProps extends IFieldWrapperOutputProps, IDateFieldProps, IDateAndTimeOutput {
    onBlur: () => void,
    localeUtils: any,
    onInputChange: any,
    isPanelOpen: boolean,
    openPanel: any
    inputProps: {
        [key: string]: any,
    },
    closePanel: any,
    onDayClick: any,
    clearInput: any,
    displayFormat: string,
    valueFormat: string,
}

function DateField(props: IDateFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();
    const {
        parseDate,
        formatDate,
    } = useDateAndTime({
        formatsArray: [
            props.displayFormat,
            props.valueFormat,
        ],
    });

    const [innerInput, setInnerInput] = useState<string>('');
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

    const updateInputValue = useCallback((date: string) => {
        props.input.onChange.call(null, date);
        if (props.onChange) {
            props.onChange(date);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChange = useCallback(value => {
        setInnerInput(value);
        const parsedDate = parseDate(value);
        if (parsedDate) {
            updateInputValue(formatDate(parsedDate, props.valueFormat));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onDayClick = useCallback((day) => {
        updateInputValue(formatDate(day, props.valueFormat));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openPanel = useCallback(() => {
        if (!isPanelOpen) {
            setIsPanelOpen(true);
        }
    }, [isPanelOpen]);

    const closePanel = useCallback(() => {
        if (isPanelOpen) {
            setIsPanelOpen(false);
        }
    }, [isPanelOpen]);

    const clearInput = useCallback(() => {
        setIsPanelOpen(false);
        setInnerInput('');
        props.input.onChange.call(null, null);
    }, [props.input.onChange]);

    // TODO onBlur, clear garbage in input
    const onBlur = useCallback(() => {}, []);

    // Listen to input changes -> update state
    useEffect(() => {
        if (props.input.value) {
            const valueAsDate = parseDate(props.input.value);
            const valueAsString = formatDate(valueAsDate, props.displayFormat);
            if (!innerInput || valueAsString !== innerInput) {
                setInnerInput(valueAsString);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.input.value]);

    const inputProps = useMemo(() => ({
        autoComplete: 'off',
        disabled: props.disabled,
        placeholder: props.placeholder || props.displayFormat,
        required: props.required,
        name: props.input.name,
        type: 'text',
        value: innerInput,
        onChange,
        ...props.inputProps,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [innerInput, props.disabled, props.input.name, props.inputProps, props.placeholder, props.required]);

    return components.ui.renderView(props.view || 'form.DateFieldView', {
        ...props,
        onBlur,
        onChange,
        openPanel,
        parseDate,
        clearInput,
        closePanel,
        formatDate,
        inputProps,
        onDayClick,
        isPanelOpen,
        displayFormat: props.displayFormat,
        valueFormat: props.valueFormat,
    });
}

DateField.defaultProps = {
    disabled: false,
    displayFormat: 'DD.MM.YYYY',
    icon: true,
    required: false,
    showRemove: true,
    valueFormat: 'YYYY-MM-DD',
};

export default fieldWrapper('DateField', DateField);
