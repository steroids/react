import {useMemo} from 'react';
import useDateInputState, {
    IDateInputStateInput,
    IDateInputStateOutput,
} from '../../form/DateField/useDateInputState';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperOutputProps} from '../Field/fieldWrapper';

export interface ITimePanelViewProps extends Pick<ITimeFieldViewProps,
    'value' | 'onClose' | 'onNow' | 'onSelect' | 'className'>
{
    showHeader?: boolean,
    showNow?: boolean,
}

/**
 * TimeField
 * Поле для выбора времени
 */
export interface ITimeFieldProps extends IDateInputStateInput, IUiComponent {
    /**
     * Отключить border вокруг элемента
     * @example 'true'
     */
    noBorder?: boolean,

    /**
     * Свойства для view компонента
     */
    viewProps?: Record<string, unknown>,

    /**
     * Свойства для компонента панели времени
     */
    timePanelViewProps?: any,

    [key: string]: any;
}

export interface ITimeFieldViewProps extends IDateInputStateOutput,
    Pick<ITimeFieldProps, 'size' | 'errors' | 'showRemove' | 'noBorder' | 'className' | 'timePanelViewProps' | 'style'>
{
    [key: string]: any;
}

function TimeField(props: ITimeFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const {
        onNow,
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

    const timePanelViewProps = useMemo(() => ({
        onNow,
        onClose,
        value: inputProps.value,
        onSelect: inputProps.onChange,
        ...props.timePanelViewProps,
    }), [inputProps.onChange, inputProps.value, onClose, onNow, props.timePanelViewProps]);

    return components.ui.renderView(props.view || 'form.TimeFieldView', {
        ...props.viewProps,
        onNow,
        onClear,
        onClose,
        isOpened,
        inputProps,
        timePanelViewProps,
        size: props.size,
        icon: props.icon,
        errors: props.errors,
        noBorder: props.noBorder,
        disabled: props.disabled,
        className: props.className,
        showRemove: props.showRemove,
    });
}

TimeField.defaultProps = {
    disabled: false,
    displayFormat: 'HH:mm',
    required: false,
    placeholder: 'Select time',
    showRemove: true,
    type: 'text',
    valueFormat: 'HH:mm',
    useUTC: true,
    dateInUTC: false,
    size: 'md',
    icon: true,
};

export default fieldWrapper<ITimeFieldProps>('TimeField', TimeField);
