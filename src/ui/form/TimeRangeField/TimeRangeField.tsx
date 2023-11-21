import React, {useCallback, useMemo} from 'react';
import {useComponents} from '../../../hooks';
import useDateInputState, {IDateInputStateInput, IDateInputStateOutput} from '../DateField/useDateInputState';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import useDateRange from '../DateField/useDateRange';
import {ITimePanelViewProps} from '../TimeField/TimeField';

/**
 * TimeRangeField
 *
 * Компонент TimeRangeField представляет собой поле выбора временного диапазона, состоящего из двух элементов ввода времени (from и to).
 **/
export interface ITimeRangeFieldProps extends IDateInputStateInput,
    Omit<IFieldWrapperInputProps, 'attribute'>,
    IUiComponent {

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
    * Свойства для view компонента
    */
    viewProps?: Record<string, unknown>,

    /**
     * Свойства для компонента панели времени
     */
    timePanelViewProps?: any,

    /**
    * Свойства для input элемента from
    */
    inputPropsFrom?: any,

    /**
    * Свойства для input элемента to
    */
    inputPropsTo?: any,

    /**
    * Placeholder подсказка
    * @example Your text...
    */
    placeholder?: any;

    /**
     * Свойства для компонента DayPickerInput
     * @example
     * {
     *  dayPickerProps: {
     *   showWeekNumbers: true
     *  }
     */
    pickerProps?: any;

    [key: string]: any;
}

export interface ITimeRangeFieldViewProps extends IDateInputStateOutput,
    Pick<ITimeRangeFieldProps, 'size' | 'errors' | 'showRemove' | 'className' | 'timePanelViewProps' | 'disabled' | 'style' | 'icon'>,
    Omit<IFieldWrapperOutputProps, 'input'> {

    inputFrom?: any,
    inputTo?: any,
    errorsFrom?: string[],
    errorsTo?: string[],

    timePanelFromViewProps: ITimePanelViewProps,
    timePanelToViewProps: ITimePanelViewProps,

    [key: string]: any;
}

interface ITimeRangeFieldPrivateProps extends ITimeRangeFieldProps, Omit<IFieldWrapperOutputProps, 'input' | 'errors'> {
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

function TimeRangeField(props: ITimeRangeFieldPrivateProps) {
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
        onNow: onNowFrom,
        onClose: onCloseFrom,
        inputProps: inputPropsFrom,
        onClear: onClearFrom,
        isOpened: isOpenedFrom,
    } = useDateInputState({
        input: props.inputFrom,
        disabled: props.disabled,
        onChange,
        required: props.required,
        inputProps: props.inputPropsFrom,
        placeholder: props.placeholder,
        valueFormat: props.valueFormat,
        displayFormat: props.displayFormat,

    });

    // Input 'to'
    const {
        onNow: onNowTo,
        onClose: onCloseTo,
        inputProps: inputPropsTo,
        onClear: onClearTo,
        isOpened: isOpenedTo,
    } = useDateInputState({
        input: props.inputTo,
        disabled: props.disabled,
        onChange,
        required: props.required,
        inputProps: props.inputPropsTo,
        placeholder: props.placeholder,
        valueFormat: props.valueFormat,
        displayFormat: props.displayFormat,

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
        useSmartFocus: true,
    });

    const timePanelFromViewProps = useMemo(() => ({
        onNow: onNowFrom,
        onClose: onCloseFrom,
        value: inputPropsFrom.value,
        onSelect: inputPropsFrom.onChange,
        ...props.timePanelViewProps,
    }), [inputPropsFrom.onChange, inputPropsFrom.value, onCloseFrom, onNowFrom, props.timePanelViewProps]);

    const timePanelToViewProps = useMemo(() => ({
        onNow: onNowTo,
        onClose: onCloseTo,
        value: inputPropsTo.value,
        onSelect: inputPropsTo.onChange,
        ...props.timePanelViewProps,
    }), [inputPropsTo.onChange, inputPropsTo.value, onCloseTo, onNowTo, props.timePanelViewProps]);

    return components.ui.renderView(props.view || 'form.TimeRangeFieldView', {
        ...props.viewProps,
        onClear,
        onClose,
        inputPropsFrom: extendedInputPropsFrom,
        inputPropsTo: extendedInputPropsTo,
        isOpened: focus === 'from' ? isOpenedFrom : isOpenedTo,
        style: props.style,
        errorsFrom: props.errorsFrom,
        errorsTo: props.errorsTo,
        timePanelFromViewProps,
        timePanelToViewProps,
        size: props.size,
        icon: props.icon,
        disabled: props.disabled,
        showRemove: props.showRemove,
        className: props.className,
    });
}

TimeRangeField.defaultProps = {
    disabled: false,
    displayFormat: 'HH:mm',
    required: false,
    showRemove: true,
    type: 'text',
    valueFormat: 'HH:mm',
    useUTC: true,
    dateInUTC: false,
    size: 'md',
    icon: true,
};

export default fieldWrapper<ITimeRangeFieldProps>('TimeRangeField', TimeRangeField, {
    attributeSuffixes: ['from', 'to'],
});
