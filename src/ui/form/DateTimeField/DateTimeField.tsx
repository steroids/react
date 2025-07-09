import React, {useMemo} from 'react';
import {MaskitoOptions} from '@maskito/core';
import {maskitoDateTimeOptionsGenerator} from '@maskito/kit';
import {useMaskito} from '@maskito/react';
import useDateTime from '../DateField/useDateTime';
import {ICalendarProps} from '../../content/Calendar/Calendar';
import useDateInputState, {
    IDateInputStateInput,
    IDateInputStateOutput,
} from '../../form/DateField/useDateInputState';
import fieldWrapper, {IFieldWrapperOutputProps} from '../../form/Field/fieldWrapper';
import {useComponents} from '../../../hooks';
import {FieldEnum} from '../../../enums';

/**
 * DateTimeField
 *
 * Поля ввода с выпадающими списками для выбора даты и времени.
 *
 * Компонент `DateTimeField` предоставляет возможность создания полей ввода для выбора даты и времени с помощью выпадающих списков.
 *  Он объединяет функциональность компонента `DateField` для выбора даты и компонента `TimePanel` для выбора времени.
 */

export interface IDateTimeFieldProps extends IDateInputStateInput, IUiComponent {

    /**
     * Свойства для компонента Calendar
     */
    calendarProps?: ICalendarProps,

    /**
     * Свойства для компонента панели времени
     */
    timePanelViewProps?: any,

    /**
     * Опции маски для поля ввода
     */
    maskOptions?: MaskitoOptions,

    /**
     * Разделитель для даты и времени, не влияет на отображение
     */
    dateTimeSeparator?: string,

    [key: string]: any,
}

export interface IDateTimeFieldViewProps extends IDateInputStateOutput,
    Pick<IDateTimeFieldProps, 'size' | 'errors' | 'showRemove' | 'calendarProps' | 'className' | 'timePanelViewProps'> {
    /**
     * Ref для input элемента, который накладывает маску
     */
    maskInputRef?: React.RefCallback<HTMLElement>,

    [key: string]: any,
}

const DATE_TIME_SEPARATOR = ', ';

/**
 * DateTimeField
 * Поля ввода с выпадающими списками для выбора даты и времени
 */
function DateTimeField(props: IDateTimeFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const maskInputRef = useMaskito({options: props.maskOptions});

    const {
        onClear,
        onClose,
        isOpened,
        inputProps,
    } = useDateInputState({
        input: props.input,
        disabled: props.disabled,
        onChange: props.onChange,
        required: props.required,
        inputProps: props.inputProps,
        placeholder: props.placeholder,
        valueFormat: props.valueFormat,
        displayFormat: props.displayFormat,
        useUTC: props.useUTC,
        dateInUTC: props.dateInUTC,
    });

    const {
        dateValueFormat,
        dateValue,
        timeValue,
        onDateSelect,
        onTimeSelect,
    } = useDateTime({
        displayFormat: props.displayFormat,
        dateTimeSeparator: props.dateTimeSeparator ?? DATE_TIME_SEPARATOR,
        input: props.input,
        valueFormat: props.valueFormat,
        useUTC: props.useUTC,
        dateInUTC: props.dateInUTC,
    });

    // Calendar props
    const calendarProps = useMemo(() => ({
        value: dateValue,
        onChange: onDateSelect,
        valueFormat: dateValueFormat,
        ...props.calendarProps,
    }), [dateValue, dateValueFormat, onDateSelect, props.calendarProps]);

    // TimePanel props
    const timePanelViewProps = useMemo(() => ({
        onClose,
        showHeader: true,
        showNow: false,
        value: timeValue,
        onSelect: onTimeSelect,
    }), [onClose, onTimeSelect, timeValue]);

    const viewProps = useMemo(() => ({
        isOpened,
        onClear,
        onClose,
        maskInputRef,
        inputProps,
        calendarProps,
        timePanelViewProps,
        placeholder: props.placeholder,
        size: props.size,
        icon: props.icon,
        errors: props.errors,
        className: props.className,
        showRemove: props.showRemove,
        disabled: props.disabled,
        style: props.style,
        id: props.id,
    }), [
        calendarProps, inputProps, isOpened, maskInputRef, onClear, onClose, props.className, props.disabled, props.errors,
        props.icon, props.id, props.placeholder, props.showRemove, props.size, props.style, timePanelViewProps,
    ]);

    return components.ui.renderView(props.view || 'form.DateTimeFieldView', viewProps);
}

DateTimeField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    displayFormat: 'DD.MM.YYYY' + DATE_TIME_SEPARATOR + 'HH:mm',
    valueFormat: 'YYYY-MM-DD' + DATE_TIME_SEPARATOR + 'HH:mm',
    useUTC: false,
    dateInUTC: false,
    icon: true,
    maskOptions: maskitoDateTimeOptionsGenerator({
        dateMode: 'dd/mm/yyyy',
        timeMode: 'HH:MM',
        dateSeparator: '.',
        dateTimeSeparator: DATE_TIME_SEPARATOR,
    }),
};

export default fieldWrapper<IDateTimeFieldProps>(FieldEnum.DATE_TIME_FIELD, DateTimeField);
