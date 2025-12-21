import React, {useMemo} from 'react';
import {MaskitoOptions} from '@maskito/core';
import {useMaskito} from '@maskito/react';
import {maskitoDateOptionsGenerator} from '@maskito/kit';
import {IAbsolutePositioningInputProps} from '@steroidsjs/core/hooks/useAbsolutePositioning';
import {ICalendarProps} from '../../content/Calendar/Calendar';
import {useComponents} from '../../../hooks';
import useDateInputState, {IDateInputStateInput, IDateInputStateOutput} from './useDateInputState';
import fieldWrapper, {
    IFieldWrapperOutputProps,
} from '../../form/Field/fieldWrapper';
import {FieldEnum} from '../../../enums';

/**
 * DateField
 *
 * Поле ввода с выпадающим календарём для выбора даты.
 *
 * Компонент `DateField` предоставляет возможность создания поля ввода с календарём для выбора даты.
 * Он предоставляет пользователю удобный интерфейс для выбора даты с помощью календаря,
 * а также поддерживает настройку формата отображения даты и другие параметры.
 */

export interface IDateFieldProps extends IDateInputStateInput, IUiComponent, Pick<IAbsolutePositioningInputProps, 'autoPositioning'> {
    /**
     * Свойства для view компонента
     */
    viewProps?: CustomViewProps,

    /**
     * Свойства для компонента Calendar
     */
    calendarProps?: ICalendarProps,

    /**
     * Опции маски для поля ввода
     */
    maskOptions?: MaskitoOptions,

    /**
     *  Ограничение доступных дат.
     */
    disabledDays?: {
        after?: Date,
        before?: Date,
    },

    [key: string]: any,
}

export interface IDateFieldViewProps extends IDateInputStateOutput,
    Pick<IDateFieldProps, 'size' | 'icon' | 'errors' | 'showRemove' | 'className' | 'calendarProps' | 'autoPositioning'> {

    /**
     * Ref для input элемента, который накладывает маску
     */
    maskInputRef?: React.RefCallback<HTMLElement>,

    [key: string]: any,
}

/**
 * DateField
 * Поле ввода с выпадающим календарём для выбора даты
 */
function DateField(props: IDateFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const maskInputRef = useMaskito({
        options: props.maskOptions ?? maskitoDateOptionsGenerator({
            mode: 'dd/mm/yyyy',
            separator: '.',
            min: props.disabledDays?.before ?? null,
        }),
    });

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
    });

    // Calendar props
    const calendarProps: ICalendarProps = useMemo(() => ({
        value: props.input.value,
        onChange: props.input.onChange,
        valueFormat: props.valueFormat,
        ...(
            props?.disabledDays
                ? {
                    ...props.calendarProps,
                    pickerProps: {
                        ...props.calendarProps?.pickerProps,
                        disabledDays: props.disabledDays,
                    },
                }
                : props.calendarProps
        ),
    }), [props.calendarProps, props.disabledDays, props.input.onChange, props.input.value, props.valueFormat]);

    const viewProps = useMemo(() => ({
        ...props.viewProps,
        calendarProps,
        onClear,
        onClose,
        isOpened,
        inputProps,
        size: props.size,
        icon: props.icon,
        errors: props.errors,
        label: props.label,
        disabled: props.disabled,
        className: props.className,
        showRemove: props.showRemove,
        style: props.style,
        autoPositioning: props.autoPositioning,
        maskInputRef,
        id: props.id,
    }), [
        props.viewProps, props.size, props.icon, props.errors, props.label, props.disabled,
        props.className, props.showRemove, props.style, props.autoPositioning, props.id, calendarProps,
        onClear, onClose, isOpened, inputProps, maskInputRef,
    ]);

    return components.ui.renderView(props.view || 'form.DateFieldView', viewProps);
}

DateField.defaultProps = {
    disabled: false,
    displayFormat: 'DD.MM.YYYY',
    icon: true,
    required: false,
    showRemove: true,
    autoPositioning: true,
    valueFormat: 'YYYY-MM-DD',
};

export default fieldWrapper<IDateFieldProps>(FieldEnum.DATE_FIELD, DateField);
