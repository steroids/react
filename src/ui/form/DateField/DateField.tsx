import * as React from 'react';
import {useCallback, useMemo, useState} from 'react';
import useDateAndTime, {IDateAndTimeOutput} from '../../../hooks/useDateAndTime';
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
}

function DateField(props: IDateFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();
    const {
        month,
        toYear,
        fromYear,
        parseDate,
        formatDate,
        selectedDays,
        handleDayClick,
        handleYearMonthChange,
    } = useDateAndTime({
        displayFormat: props.displayFormat,
        valueFormat: props.valueFormat,
        formatsArray: [
            props.displayFormat,
            props.valueFormat,
        ],
    });

    const [innerInput, setInnerInput] = useState<string>('');
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

    const onChange = useCallback(value => {
        setInnerInput(value);
        const parsedDate = parseDate(value);
        if (parsedDate) {
            handleDayClick(parsedDate);
            const date = formatDate(value, props.valueFormat);
            props.input.onChange.call(null, date);
            if (props.onChange) {
                props.onChange(date);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onDayClick = useCallback((day) => {
        handleDayClick(day);
        setInnerInput(formatDate(day, props.displayFormat));
        props.input.onChange.call(null, formatDate(day, props.valueFormat));
    }, [formatDate, handleDayClick, props.displayFormat, props.input.onChange, props.valueFormat]);

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
        setInnerInput(null);
        setIsPanelOpen(false);
        handleDayClick(null);
        props.input.onChange.call(null, null);
    }, [handleDayClick, props.input.onChange]);

    // TODO onBlur, clear garbage in input
    const onBlur = useCallback(() => {}, []);

    const inputProps = useMemo(() => ({
        type: props.type,
        name: props.input.name,
        autoComplete: 'off',
        disabled: props.disabled,
        required: props.required,
        placeholder: props.placeholder || props.displayFormat,
        value: innerInput,
        onChange,
        ...props.inputProps,
    }), [innerInput, onChange, props.disabled, props.displayFormat, props.input.name, props.inputProps, props.placeholder, props.required, props.type]);

    return components.ui.renderView(props.view || 'form.DateFieldView', {
        ...props,
        month,
        toYear,
        onBlur,
        fromYear,
        onChange,
        openPanel,
        parseDate,
        clearInput,
        closePanel,
        formatDate,
        inputProps,
        onDayClick,
        isPanelOpen,
        selectedDays,
        locale: components.locale,
        handleYearMonthChange,
    });
}

DateField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    displayFormat: 'DD.MM.YYYY',
    valueFormat: 'YYYY-MM-DD',
    showRemove: true,
    icon: true,
};

export default fieldWrapper('DateField', DateField);
