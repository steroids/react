import useDateInputState, {
    IDateInputStateInput,
    IDateInputStateOutput,
} from '@steroidsjs/core/ui/form/DateField/useDateInputState';
import {useMemo} from 'react';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperOutputProps} from '../Field/fieldWrapper';

/**
 * TimeField
 * Поле для выбора времени
 */
export interface ITimeFieldProps extends IDateInputStateInput {
    /**
     * Отключить border вокруг элемента
     * @example 'true'
     */
    noBorder?: boolean,

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;

    /**
     * Дополнительный CSS-класс для элемента отображения
     */
    className?: CssClassName;

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: any;

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
    Pick<ITimeFieldProps, 'size' | 'errors' | 'showRemove' | 'noBorder' | 'className' | 'timePanelViewProps'>
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
        className: props.className,
        showRemove: props.showRemove,
    });
}

TimeField.defaultProps = {
    disabled: false,
    displayFormat: 'HH:mm',
    required: false,
    placeholder: 'Select time',
    noBorder: false,
    showRemove: true,
    type: 'text',
    valueFormat: 'HH:mm',
};

export default fieldWrapper('TimeField', TimeField);
