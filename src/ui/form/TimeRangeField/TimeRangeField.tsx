import {MaskitoOptions} from '@maskito/core';
import {useMaskito} from '@maskito/react';
import {useCallback, useMemo} from 'react';

import {FieldEnum} from '../../../enums';
import {useComponents} from '../../../hooks';
import useDateInputState, {IDateInputStateInput, IDateInputStateOutput} from '../DateField/useDateInputState';
import useDateRange from '../DateField/useDateRange';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import {ITimePanelViewProps} from '../TimeField/TimeField';
import {createTimeMask} from '../TimeField/utils';

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
    attributeFrom?: string,

    /**
     * Аттрибут (название) поля в форме
     * @example 'toTime'
     */
    attributeTo?: string,

    /**
    * Свойства для view компонента
    */
    viewProps?: CustomViewProps,

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
    placeholder?: any,

    /**
     * Свойства для компонента DayPickerInput
     * @example
     * {
     *  dayPickerProps: {
     *   showWeekNumbers: true
     *  }
     */
    pickerProps?: any,

    /**
     * Устанавливать ли фокус и показывать панель времени сразу после рендера страницы
     * @example true
     */
    hasInitialFocus?: boolean,

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
     * Ограничение доступного времени.
     */
    availableTime?: {
        from: string,
        to: string,
    },

    /**
     * Шаг минут
     * @example 15
     */
    minuteStep?: number,

    [key: string]: any,
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

    [key: string]: any,
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

    const maskFromRef = useMaskito({
        options: props.maskOptions?.from ?? createTimeMask({
            from: props.availableTime?.from,
            to: props.availableTime?.to,
            minuteStep: props.minuteStep,
        }),
    });

    const maskToRef = useMaskito({
        options: props.maskOptions?.to ?? createTimeMask({
            from: props.availableTime?.from,
            to: props.availableTime?.to,
            minuteStep: props.minuteStep,
        }),
    });

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
        useUTC: props.useUTC,
        dateInUTC: props.dateInUTC,
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
        useUTC: props.useUTC,
        dateInUTC: props.dateInUTC,
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
    });

    const timePanelFromViewProps = useMemo(() => ({
        onNow: onNowFrom,
        onClose: onCloseFrom,
        value: inputPropsFrom.value,
        onSelect: inputPropsFrom.onChange,
        availableTime: props.availableTime,
        minuteStep: props.minuteStep,
        ...props.timePanelViewProps,
    }), [inputPropsFrom.onChange, inputPropsFrom.value, onCloseFrom, onNowFrom, props.availableTime, props.minuteStep, props.timePanelViewProps]);

    const timePanelToViewProps = useMemo(() => ({
        onNow: onNowTo,
        onClose: onCloseTo,
        value: inputPropsTo.value,
        onSelect: inputPropsTo.onChange,
        availableTime: props.availableTime,
        minuteStep: props.minuteStep,
        ...props.timePanelViewProps,
    }), [inputPropsTo.onChange, inputPropsTo.value, onCloseTo, onNowTo, props.availableTime, props.minuteStep, props.timePanelViewProps]);

    const viewProps = useMemo(() => ({
        ...props.viewProps,
        onClear,
        onClose,
        inputPropsFrom: extendedInputPropsFrom,
        inputPropsTo: extendedInputPropsTo,
        isOpened: focus === 'from' ? isOpenedFrom : isOpenedTo,
        style: props.style,
        errorsFrom: props.errorsFrom,
        errorsTo: props.errorsTo,
        errors: props.errors,
        timePanelFromViewProps,
        timePanelToViewProps,
        size: props.size,
        icon: props.icon,
        disabled: props.disabled,
        showRemove: props.showRemove,
        className: props.className,
        id: props.id,
        maskFromRef,
        maskToRef,
        // eslint-disable-next-line max-len
    }), [extendedInputPropsFrom, extendedInputPropsTo, focus, isOpenedFrom, isOpenedTo, maskFromRef, maskToRef, onClear, onClose, props.className, props.disabled, props.errors, props.errorsFrom, props.errorsTo, props.icon, props.id, props.showRemove, props.size, props.style, props.viewProps, timePanelFromViewProps, timePanelToViewProps]);

    return components.ui.renderView(props.view || 'form.TimeRangeFieldView', viewProps);
}

TimeRangeField.defaultProps = {
    disabled: false,
    displayFormat: 'HH:mm',
    required: false,
    showRemove: true,
    hasInitialFocus: false,
    type: 'text',
    valueFormat: 'HH:mm',
    useUTC: false,
    dateInUTC: false,
    icon: true,
    minuteStep: 1,
};

export default fieldWrapper<ITimeRangeFieldProps>(FieldEnum.TIME_RANGE_FIELD, TimeRangeField, {
    attributeSuffixes: ['from', 'to'],
});
