import React, {useCallback, useMemo} from 'react';
import {MaskitoOptions} from '@maskito/core';
import {maskitoDateOptionsGenerator} from '@maskito/kit';
import {useMaskito} from '@maskito/react';
import {ICalendarProps} from '../../content/Calendar/Calendar';
import useDateRange from '../../form/DateField/useDateRange';
import {useComponents} from '../../../hooks';
import useDateInputState, {IDateInputStateInput, IDateInputStateOutput} from '../DateField/useDateInputState';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../../form/Field/fieldWrapper';
import useOnDayClick from './useOnDayClick';

/**
 * DateRangeField
 *
 * Поле ввода дипазона двух дат с выпадающим календарём.
 *
 * Компонент `DateRangeField` предоставляет возможность создания поля ввода диапазона двух дат с выпадающим календарём.
 *  Он позволяет пользователю выбрать начальную и конечную даты с помощью календаря и предоставляет удобный интерфейс для работы с диапазоном дат.
 */
export interface IDateRangeFieldProps extends IDateInputStateInput,
    Omit<IFieldWrapperInputProps, 'attribute'>, IUiComponent {
    /**
     * Аттрибут (название) поля в форме
     * @example 'fromTime'
     */
    attributeFrom?: string,

    /**
     * Аттрибут (название) поля в форме
     * @example 'toTime'
     */
    attributeTo?: string,

    /**
     * Свойства для компонента DayPickerInput
     * @example
     * {
     *  dayPickerProps: {
     *   showWeekNumbers: true
     *  }
     * }
     */
    pickerProps?: any,

    /**
     * Формат даты показываемый пользователю
     * @example DD.MM.YYYY
     */
    displayFormat?: string,

    /**
     * Формат даты отправляемый на сервер
     * @example YYYY-MM-DD
     */
    valueFormat?: string,

    /**
     * Placeholder подсказка
     * @example Your text...
     */
    placeholder?: any,

    /**
     * Иконка
     * @example calendar-day
     */
    icon?: boolean | string,

    /**
     * Отображение кнопки для сброса значения поля
     * @example true
     */
    showRemove?: boolean,

    /**
    * Свойства для input элемента from
    */
    inputPropsFrom?: any,

    /**
    * Свойства для input элемента to
    */
    inputPropsTo?: any,

    /**
     * Свойства для компонента Calendar
     */
    calendarProps?: ICalendarProps,

    /**
     * Устанавливать ли фокус и показывать календарь сразу после рендера страницы
     * @example true
     */
    hasInitialFocus?: boolean,

    /**
     * Перемещать ли фокус на пустое после заполнения
     * @example true
     */
    useSmartFocus?: boolean,

    /**
    * Опции маски для полей
    */
    maskOptions?: {
        /**
        * Опции маски для поля from
        */
        from: MaskitoOptions,

        /**
        * Опции маски для поля to
        */
        to: MaskitoOptions,
    },

    /**
     * Перемещать ли фокус на "from" при клике на начало диапазона
     * или на "to" при клике на конец диапазона
     * @example true
     */
    useFocusOnRangeEdgeClick?: boolean,

    [key: string]: any,
}

export interface IDateRangeFieldViewProps extends IDateInputStateOutput,
    Omit<IFieldWrapperOutputProps, 'input'>,
    Pick<IDateRangeFieldProps,
        'size' | 'icon' | 'errors' | 'showRemove' | 'calendarProps' | 'className' | 'disabled'
        | 'noBorder' | 'style'> {
    inputPropsFrom?: any,
    inputPropsTo?: any,
    errorsFrom?: string[],
    errorsTo?: string[],

    /**
     * Ref для input элемента, который накладывает маску на поле from
     */
    maskInputFromRef?: React.RefCallback<HTMLElement>,

    /**
     * Ref для input элемента, который накладывает маску на поле to
     */
    maskInputFromTo?: React.RefCallback<HTMLElement>,

    id: string,
}

interface IDateRangeFieldPrivateProps extends IDateRangeFieldProps, Omit<IFieldWrapperOutputProps, 'input' | 'errors'> {
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

function DateRangeField(props: IDateRangeFieldPrivateProps): JSX.Element {
    const components = useComponents();

    const maskInputFromRef = useMaskito({options: props.maskOptions?.from});
    const maskInputToRef = useMaskito({options: props.maskOptions?.to});

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
    } = useDateInputState({
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
    } = useDateInputState({
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
        useSmartFocus: props.useSmartFocus,
        hasInitialFocus: props.hasInitialFocus,
        displayFormat: props.displayFormat,
        valueFormat: props.valueFormat,
    });

    React.useEffect(() => {
        if (extendedInputPropsFrom.ref && extendedInputPropsTo.ref) {
            maskInputFromRef(extendedInputPropsFrom.ref.current);
            maskInputToRef(extendedInputPropsTo.ref.current);
        }
    }, [
        extendedInputPropsFrom.ref,
        extendedInputPropsTo.ref,
        maskInputFromRef,
        maskInputToRef,
    ]);

    const onDayClick = useOnDayClick({
        focus,
        useFocusOnRangeEdgeClick: props.useFocusOnRangeEdgeClick,
        fromValue: props.inputFrom.value,
        toValue: props.inputTo.value,
        onFromChange: props.inputFrom.onChange,
        onToChange: props.inputTo.onChange,
        fromRef: extendedInputPropsFrom.ref,
        toRef: extendedInputPropsTo.ref,
    });

    // Calendar props
    const calendarProps: ICalendarProps = useMemo(() => ({
        value: [props.inputFrom.value, props.inputTo.value],
        onChange: onDayClick,
        valueFormat: props.valueFormat,
        numberOfMonths: 2,
        showFooter: false,
    }), [onDayClick, props.inputFrom.value, props.inputTo.value, props.valueFormat]);

    const viewProps = useMemo(() => ({
        onClear,
        onClose,
        calendarProps,
        icon: props.icon,
        size: props.size,
        disabled: props.disabled,
        className: props.className,
        showRemove: props.showRemove,
        errorsFrom: props.errorsFrom,
        errorsTo: props.errorsTo,
        inputPropsTo: extendedInputPropsTo,
        inputPropsFrom: extendedInputPropsFrom,
        isOpened: focus === 'from' ? isOpenedFrom : isOpenedTo,
        style: props.style,
        id: props.id,
    }), [calendarProps, extendedInputPropsFrom, extendedInputPropsTo, focus, isOpenedFrom, isOpenedTo, onClear, onClose,
        props.className, props.disabled, props.errorsFrom, props.errorsTo, props.icon, props.id, props.showRemove, props.size, props.style]);

    return components.ui.renderView(props.view || 'form.DateRangeFieldView', viewProps);
}

DateRangeField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    displayFormat: 'DD.MM.YYYY',
    valueFormat: 'YYYY-MM-DD',
    showRemove: true,
    useSmartFocus: true,
    hasInitialFocus: false,
    icon: true,
    useFocusOnRangeEdgeClick: true,
    maskOptions: {
        from: maskitoDateOptionsGenerator({
            mode: 'dd/mm/yyyy',
            separator: '.',
        }),
        to: maskitoDateOptionsGenerator({
            mode: 'dd/mm/yyyy',
            separator: '.',
        }),
    },
};

export default fieldWrapper<IDateRangeFieldProps>('DateRangeField', DateRangeField,
    {attributeSuffixes: ['from', 'to']});
