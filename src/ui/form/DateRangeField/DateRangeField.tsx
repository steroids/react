import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import useDateAndTime, {IDateAndTimeOutput} from '@steroidsjs/core/hooks/useDateAndTime';
import {useMount} from 'react-use';
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
    onInputChange: any,
    isPanelOpen: boolean,
    openPanel: any
    inputProps: {
        [key: string]: any,
    },
    closePanel: any,
    onDayClick: any,
    clearInput: any,
    state: {
        to: string,
        from: string,
    },
}

function DateRangeField(props: IDateRangeFieldProps & IFieldWrapperOutputProps) {
    const components = useComponents();
    const {
        month,
        toYear,
        fromYear,
        parseDate,
        formatDate,
        selectedRange,
        addDateToRange,
        updateRange,
        handleYearMonthChange,
    } = useDateAndTime({
        formatsArray: [
            props.displayFormat,
            props.valueFormat,
        ],
    });

    const parseToState = useCallback(() => {
        const wrapperInputValue = props.input.value ? props.input.value.split(' ') : [];
        return {
            from: wrapperInputValue[0] || '',
            to: wrapperInputValue[1] || '',
        };
    }, [props.input.value]);
    const [state, setState] = useState<{from: string, to: string}>(parseToState());
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

    // Set initial values for calendar (get from Form)
    useMount(() => {
        const wrapperInputValue = props.input.value ? props.input.value.split(' ') : [];
        if (wrapperInputValue.length > 0) {
            updateRange({
                from: parseDate(wrapperInputValue[0]),
                to: parseDate(wrapperInputValue[1]),
            });
        }
    });

    const updateWrapperInput = useCallback((from: Date, to: Date) => {
        const range = formatDate(from, props.valueFormat) + ' ' + formatDate(to, props.valueFormat);
        props.input.onChange.call(null, range);
        if (props.onChange) {
            props.onChange(range);
        }
    }, [formatDate, props]);

    const stateCbRef = useRef(null);
    const onChange = useCallback(value => {
        stateCbRef.current = state => {
            const parsedFrom = parseDate(state.from);
            const parsedTo = parseDate(state.to);
            if (parsedFrom && parsedTo) {
                updateRange({
                    from: parsedFrom,
                    to: parsedTo,
                });
                updateWrapperInput(parsedFrom, parsedTo);
            }
        };
        const newState = {...state, ...value};
        setState(newState);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    useEffect(() => {
        if (stateCbRef.current) {
            stateCbRef.current(state);
            stateCbRef.current = null;
        }
    }, [state]);

    const onDayClick = useCallback((day) => {
        const newRange = updateRange(addDateToRange(day));
        setState({
            from: formatDate(newRange.from, props.displayFormat) || '',
            to: formatDate(newRange.to, props.displayFormat) || '',
        });
        if (newRange.from && newRange.to) {
            updateWrapperInput(newRange.from, newRange.to);
        }
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
        setState(parseToState());
        updateRange({from: undefined, to: undefined});
        props.input.onChange.call(null, null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // TODO onBlur, clear garbage in input
    const onBlur = useCallback(() => {}, []);

    const inputProps = useMemo(() => ({
        type: 'text',
        name: props.input.name,
        autoComplete: 'off',
        disabled: props.disabled,
        required: props.required,
        placeholder: props.placeholder || props.displayFormat,
        onChange,
        ...props.inputProps,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [props.disabled, props.displayFormat, props.input.name, props.inputProps, props.placeholder, props.required, props.type]);

    return components.ui.renderView(props.view || 'form.DateRangeFieldView', {
        ...props,
        state,
        month,
        toYear,
        onBlur,
        fromYear,
        onChange,
        openPanel,
        clearInput,
        closePanel,
        inputProps,
        onDayClick,
        isPanelOpen,
        selectedRange,
        handleYearMonthChange,
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
