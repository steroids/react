import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import moment from 'moment';
import useDateAndTime, {IDateAndTimeOutput} from '@steroidsjs/core/ui/form/DateField/useDateAndTime';
import {convertDate} from '@steroidsjs/core/utils/calendar';
import {ITimePanelViewProps} from '@steroidsjs/bootstrap/form/TimeField/TimePanelView';
import {ICalendarProps} from '@steroidsjs/core/ui/content/Calendar/Calendar';
import {usePrevious} from 'react-use';
import useDateRange from '@steroidsjs/core/ui/form/DateField/useDateRange';
import useDateTime from '@steroidsjs/core/ui/form/DateField/useDateTime';
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
        dateValue: dateValueFrom,
        timeValue: timeValueFrom,
        onDateSelect: onDateFromSelect,
        onTimeSelect: onTimeFromSelect,
    } = useDateTime({
        displayFormat: props.displayFormat,
        valueFormat: props.valueFormat,
        DATE_TIME_SEPARATOR,
        input: props.inputFrom,
    });

    const {
        dateValue: dateValueTo,
        timeValue: timeValueTo,
        onDateSelect: onDateToSelect,
        onTimeSelect: onTimeToSelect,
    } = useDateTime({
        displayFormat: props.displayFormat,
        valueFormat: props.valueFormat,
        DATE_TIME_SEPARATOR,
        input: props.inputTo,
    });

    const {
        focus,
        onClose,
        onClear,
        extendedInputPropsFrom,
        extendedInputPropsTo,
    } = useDateRange({
        onClearFrom,
        onCloseTo,
        onCloseFrom,
        onClearTo,
        inputPropsFrom,
        inputPropsTo,
        inputFrom: props.inputFrom,
        inputTo: props.inputTo,
    });

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
        onNow,
        onClose,
    }), [focus, onClose, onNow, onTimeFromSelect, onTimeToSelect, timeValueFrom, timeValueTo]);

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
