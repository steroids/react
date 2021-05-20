import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {DateUtils} from 'react-day-picker';
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
export interface IDateRangeFieldProps extends IFieldWrapperInputProps {
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

    [key: string]: any;
}

export interface IDateRangeFieldViewProps extends IFieldWrapperOutputProps, IDateRangeFieldProps, IDateAndTimeOutput {
    onBlur: () => void,
    localeUtils: any,
    isPanelOpen: boolean,
    openPanel: any
    inputFromProps: {
        [key: string]: any,
    },
    inputToProps: {
        [key: string]: any,
    },
    closePanel: any,
    onDayClick: any,
    clearInput: any,
}

function DateRangeField(props: IDateRangeFieldProps & IFieldWrapperOutputProps) {
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

    const [inputTo, setInputTo] = useState<string>('');
    const [inputFrom, setInputFrom] = useState<string>('');
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

    const valueRef = useRef(null);
    const updateInputValue = useCallback((range: {from: string, to: string}) => {
        if (!!range.to && !!range.from) {
            if (DateUtils.isDayAfter(parseDate(range.from), parseDate(range.to))) {
                const bufferFrom = range.to;
                range.to = range.from;
                range.from = bufferFrom;
            }
        }
        props.input.onChange.call(null, range);
        valueRef.current = range;
        if (props.onChange) {
            props.onChange(range);
        }
        /// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parseDate, props]);

    const onFromChange = useCallback(value => {
        setInputFrom(value);
        const parsedDate = parseDate(value);
        if (parsedDate) {
            updateInputValue({
                from: formatDate(parsedDate, props.valueFormat),
                to: valueRef.current ? valueRef.current.to : null,
            });
        }
    }, [formatDate, parseDate, props.valueFormat, updateInputValue]);

    const onToChange = useCallback(value => {
        setInputTo(value);
        const parsedDate = parseDate(value);
        if (parsedDate) {
            updateInputValue({
                from: valueRef.current ? valueRef.current.from : null,
                to: formatDate(parsedDate, props.valueFormat),
            });
        }
    }, [formatDate, parseDate, props.valueFormat, updateInputValue]);

    const onDayClick = useCallback((day) => {
        const range = DateUtils.addDayToRange(day, {
            from: valueRef.current && parseDate(valueRef.current.from),
            to: valueRef.current && parseDate(valueRef.current.to),
        });
        updateInputValue({
            from: formatDate(range.from, props.valueFormat),
            to: formatDate(range.to, props.valueFormat),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.input.value, props.valueFormat, updateInputValue]);

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
        setInputFrom('');
        setInputTo('');
        props.input.onChange.call(null, null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // TODO onBlur, clear garbage in input
    const onBlur = useCallback(() => {}, []);

    // Listen to input changes -> update state
    useEffect(() => {
        const inputValue = props.input.value;
        if (inputValue) {
            const valueAsString = {
                from: formatDate(parseDate(inputValue.from), props.displayFormat) || '',
                to: formatDate(parseDate(inputValue.to), props.displayFormat) || '',
            };
            if (!inputFrom || valueAsString.from !== inputFrom) {
                setInputFrom(valueAsString.from);
            }
            if (!inputTo || valueAsString.to !== inputTo) {
                setInputTo(valueAsString.to);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.input.value]);

    const inputFromProps = useMemo(() => ({
        autoComplete: 'off',
        disabled: props.disabled,
        placeholder: props.placeholder || props.displayFormat,
        required: props.required,
        name: props.input.name,
        type: 'text',
        value: inputFrom,
        onChange: onFromChange,
        ...props.inputProps,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [inputFrom, props.disabled, props.input.name, props.inputProps, props.placeholder, props.required]);

    const inputToProps = useMemo(() => ({
        autoComplete: 'off',
        disabled: props.disabled,
        placeholder: props.placeholder || props.displayFormat,
        required: props.required,
        name: props.input.name,
        type: 'text',
        value: inputTo,
        onChange: onToChange,
        ...props.inputProps,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [inputTo, props.disabled, props.input.name, props.inputProps, props.placeholder, props.required]);

    return components.ui.renderView(props.view || 'form.DateRangeFieldView', {
        ...props,
        onBlur,
        openPanel,
        clearInput,
        closePanel,
        inputFromProps,
        inputToProps,
        onDayClick,
        isPanelOpen,
        displayFormat: props.displayFormat,
        valueFormat: props.valueFormat,
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

export default fieldWrapper('DateRangeField', DateRangeField);
