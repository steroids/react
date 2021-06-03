import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import moment from 'moment';
import useDateAndTime, {IDateAndTimeOutput} from '@steroidsjs/core/ui/form/DateField/useDateAndTime';
import {convertDate} from '@steroidsjs/core/utils/calendar';
import {ITimePanelViewProps} from '@steroidsjs/bootstrap/form/TimeField/TimePanelView';
import {ICalendarProps} from '@steroidsjs/core/ui/content/Calendar/Calendar';
import {usePrevious} from 'react-use';
import useDateRange from '@steroidsjs/core/ui/form/DateField/useDateRange';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../../form/Field/fieldWrapper';
import {useComponents} from '../../../hooks';

/**
 * DateTimeRangeField
 * Поле ввода дипазона двух дат со временем, с выпадающим календарём
 */
export interface IDateTimeRangeFieldProps extends Omit<IFieldWrapperInputProps, 'attribute'> {
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

export interface IDateTimeRangeFieldViewProps extends
    IDateTimeRangeFieldProps, IFieldWrapperOutputProps, IDateAndTimeOutput {
    timePanelProps?: ITimePanelViewProps,
    calendarProps?: ICalendarProps,
}

interface IDateTimeRangeFieldPrivateProps extends IDateTimeRangeFieldProps,
    Omit<IFieldWrapperOutputProps, 'input' | 'errors'> {
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

const DATE_TIME_SEPARATOR = ' ';

function DateTimeRangeField(props: IDateTimeRangeFieldPrivateProps): JSX.Element {
    const components = useComponents();

    // Global onChange (from props)
    const onChange = useCallback(() => {
        if (props.onChange) {
            props.onChange.call(null, {
                [props.attributeFrom]: props.inputFrom.value,
                [props.attributeTo]: props.inputTo.value,
            });
        }
    }, [props.attributeFrom, props.attributeTo, props.inputFrom.value, props.inputTo.value, props.onChange]);

    // Input 'from'
    const {
        isOpened: isOpenedFrom,
        onClose: onCloseFrom,
        inputProps: inputPropsFrom,
        onClear: onClearFrom,
        onNow,
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

    const {
        dateValueFormat,
        timeValueFormat,
        dateValueTo,
        dateValueFrom,
        timeValueTo,
        timeValueFrom,
        onDateFromSelect,
        onTimeFromSelect,
        onDateToSelect,
        onTimeToSelect,
    } = useDateRange({
        displayFormat: props.displayFormat,
        valueFormat: props.valueFormat,
        DATE_TIME_SEPARATOR,
        inputTo: props.inputTo,
        inputFrom: props.inputFrom,
    });

    // Tracking focus for input being edited
    const [focus, setFocus] = useState<'from' | 'to'>('from');

    // Local refs to handle auto-focus
    const valueFromRef = useRef('');
    const valueToRef = useRef('');

    // Close handler
    const onClose = useCallback(() => {
        if (focus === 'from') {
            onCloseFrom();
        } else {
            onCloseTo();
        }
        valueFromRef.current = '';
        valueToRef.current = '';
    }, [focus, onCloseFrom, onCloseTo]);

    // Clear handler
    const onClear = useCallback(() => {
        onClearFrom();
        onClearTo();
    }, [onClearFrom, onClearTo]);

    // Custom onFocus for inputFrom
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

    // Custom onFocus for inputTo
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
    const calendarProps: ICalendarProps = useMemo(() => ({
        value: [dateValueFrom, dateValueTo],
        onChange: focus === 'from' ? onDateFromSelect : onDateToSelect,
        valueFormat: dateValueFormat,
    }), [dateValueFormat, dateValueFrom, dateValueTo, focus, onDateFromSelect, onDateToSelect]);

    // TimePanel props
    const timePanelProps: ITimePanelViewProps = useMemo(() => ({
        value: focus === 'from' ? timeValueFrom : timeValueTo,
        onSelect: focus === 'from' ? onTimeFromSelect : onTimeToSelect,
        valueFormat: timeValueFormat,
        onNow,
        onClose,
    }), [focus, onClose, onNow, onTimeFromSelect, onTimeToSelect, timeValueFormat, timeValueFrom, timeValueTo]);

    const prevValueFrom = usePrevious(props.inputFrom.value);
    const prevValueTo = usePrevious(props.inputTo.value);
    useEffect(() => {
        if (focus === 'from' && !valueToRef.current && prevValueFrom !== props.inputFrom.value) {
            valueFromRef.current = props.inputFrom.value;
            inputToRef.current.focus();
        }
        if (focus === 'to' && !valueFromRef.current && prevValueTo !== props.inputTo.value) {
            valueToRef.current = props.inputTo.value;
            inputFromRef.current.focus();
        }
    }, [focus, inputPropsFrom.value, inputPropsTo.value, onClose, prevValueFrom, prevValueTo, props, props.inputFrom.onChange, props.inputFrom.value, props.inputTo.onChange, props.inputTo.value, props.valueFormat]);

    return components.ui.renderView(props.view || 'form.DateTimeRangeFieldView', {
        ...props.viewProps,
        onClear,
        onClose,
        calendarProps,
        timePanelProps,
        icon: props.icon,
        size: props.size,
        errorsTo: props.errorsTo,
        className: props.className,
        showRemove: props.showRemove,
        errorsFrom: props.errorsFrom,
        inputPropsTo: extendedInputPropsTo,
        inputPropsFrom: extendedInputPropsFrom,
        isOpened: focus === 'from' ? isOpenedFrom : isOpenedTo,
    });
}

DateTimeRangeField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    displayFormat: 'DD.MM.YYYY' + DATE_TIME_SEPARATOR + 'HH:mm',
    valueFormat: 'YYYY-MM-DD' + DATE_TIME_SEPARATOR + 'HH:mm',
    showRemove: true,
    icon: true,
};

export default fieldWrapper('DateTimeRangeField', DateTimeRangeField, {attributeSuffixes: ['from', 'to']});
