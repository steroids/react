import {useCallback, useMemo} from 'react';
import {ICalendarProps} from '../../content/Calendar/Calendar';
import useDateRange from '../../form/DateField/useDateRange';
import useDateTime from '../../form/DateField/useDateTime';
import {IDateRangeFieldProps} from '../../form/DateRangeField/DateRangeField';
import useDateInputState, {
    IDateInputStateInput,
    IDateInputStateOutput,
} from '../../form/DateField/useDateInputState';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../../form/Field/fieldWrapper';
import {useComponents} from '../../../hooks';

/**
 * DateTimeRangeField
 *
 * Поле ввода дипазона двух дат со временем, с выпадающим календарём.
 *
 * Компонент `DateTimeRangeField` предоставляет возможность создания поля ввода для выбора диапазона двух дат с временем
 * с помощью выпадающих списков и календаря.
 * Он объединяет функциональность компонента `DateRangeField` для выбора диапазона дат и компонента `DateTimeField` для выбора времени.
 */
export interface IDateTimeRangeFieldProps extends Omit<IDateInputStateInput, 'inputProps' | 'input'>,
    Omit<IFieldWrapperInputProps, 'attribute'>, IUiComponent
{
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
     * @example
     * {
     *  dayPickerProps: {
     *   showWeekNumbers: true
     *  }
     * }
     */
    pickerProps?: any;

    /**
     * Свойства для поля 'from'
     */
    inputPropsFrom?: Record<string, unknown>,

    /**
     * Свойства для поля 'to'
     */
    inputPropsTo?: Record<string, unknown>,

    /**
     * Свойства для компонента панели времени
     */
    timePanelViewProps?: any,

    /**
     * Свойства для компонента Calendar
     */
    calendarProps?: ICalendarProps,

    /**
     * Устанавливать ли фокус и показывать календарь сразу после рендера страницы
     * @example true
     */
    hasInitialFocus?: boolean,

    [key: string]: any;
}

export interface IDateTimeRangeFieldViewProps extends IDateInputStateOutput,
    Omit<IFieldWrapperOutputProps, 'input'>,
    Pick<IDateRangeFieldProps,
        'size' | 'icon' | 'errors' | 'showRemove' | 'calendarProps' | 'className' | 'disabled'
        | 'noBorder' | 'style'>
{
    timePanelViewProps?: any,
    calendarProps?: ICalendarProps,
    inputPropsFrom?: any,
    inputPropsTo?: any,
    errorsFrom?: any,
    errorsTo?: any,
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
    disabled?: boolean,

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
    } = useDateInputState({
        displayFormat: props.displayFormat,
        valueFormat: props.valueFormat,
        input: props.inputFrom,
        disabled: props.disabled,
        placeholder: props.placeholder,
        required: props.required,
        inputProps: props.inputPropsFrom,
        useUTC: props.useUTC,
        dateInUTC: props.dateInUTC,
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
        useUTC: props.useUTC,
        dateInUTC: props.dateInUTC,
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
        dateTimeSeparator: DATE_TIME_SEPARATOR,
        useUTC: props.useUTC,
        dateInUTC: props.dateInUTC,
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
        dateTimeSeparator: DATE_TIME_SEPARATOR,
        useUTC: props.useUTC,
        dateInUTC: props.dateInUTC,
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
        useSmartFocus: false,
        hasInitialFocus: props.hasInitialFocus,
        displayFormat: props.displayFormat,
        valueFormat: props.valueFormat,
    });

    // Calendar props
    const calendarProps: ICalendarProps = useMemo(() => ({
        value: [dateValueFrom, dateValueTo],
        onChange: focus === 'from' ? onDateFromSelect : onDateToSelect,
        valueFormat: dateValueFormat,
        ...props.calendarProps,
    }), [dateValueFormat, dateValueFrom, dateValueTo, focus, onDateFromSelect, onDateToSelect, props.calendarProps]);

    // TimePanel props
    const timePanelViewProps = useMemo(() => ({
        value: focus === 'from' ? timeValueFrom : timeValueTo,
        onSelect: focus === 'from' ? onTimeFromSelect : onTimeToSelect,
        onNow,
        onClose,
        showNow: false,
        showHeader: true,
        ...props.timePanelViewProps,
    }), [
        focus,
        onClose,
        onNow,
        onTimeFromSelect,
        onTimeToSelect,
        props.timePanelViewProps,
        timeValueFrom,
        timeValueTo,
    ]);

    return components.ui.renderView(props.view || 'form.DateTimeRangeFieldView', {
        ...props.viewProps,
        onClear,
        onClose,
        calendarProps,
        timePanelViewProps,
        icon: props.icon,
        size: props.size,
        errorsTo: props.errorsTo,
        className: props.className,
        showRemove: props.showRemove,
        errorsFrom: props.errorsFrom,
        inputPropsTo: extendedInputPropsTo,
        inputPropsFrom: extendedInputPropsFrom,
        isOpened: focus === 'from' ? isOpenedFrom : isOpenedTo,
        disabled: props.disabled,
        noBorder: props.noBorder,
        style: props.style,
    });
}

DateTimeRangeField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    displayFormat: 'DD.MM.YYYY' + DATE_TIME_SEPARATOR + 'HH:mm',
    valueFormat: 'YYYY-MM-DD' + DATE_TIME_SEPARATOR + 'HH:mm',
    showRemove: true,
    hasInitialFocus: false,
    useUTC: false,
    dateInUTC: false,
    icon: true,
    size: 'md',
};

export default fieldWrapper<IDateTimeRangeFieldProps>('DateTimeRangeField', DateTimeRangeField,
    {attributeSuffixes: ['from', 'to']});
