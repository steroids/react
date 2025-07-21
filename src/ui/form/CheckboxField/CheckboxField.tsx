import {ChangeEvent, useCallback, useMemo} from 'react';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import {useComponents} from '../../../hooks';
import {FieldEnum} from '../../../enums';

/**
 * CheckboxField
 *
 * Одиночный чекбокс. Используется в формах для отметки булевого значения.
 */
export interface ICheckboxFieldProps extends IFieldWrapperInputProps, IUiComponent {

    /**
     * Свойства для элемента input
     * @example {onKeyDown: ...}
     */
    inputProps?: any,

    /**
     * Флаг определяющий включен ли элемент
     * @example true
     */
    checked?: boolean,

    /**
    * Пользовательский цвет для чекбокса
    */
    color?: string,

    [key: string]: any,
}

export interface ICheckboxFieldViewProps extends ICheckboxFieldProps, IFieldWrapperOutputProps {
    inputProps: {
        name?: string,
        type?: string,
        checked?: boolean,
        onChange?: (value: string | ChangeEvent) => void,
        disabled?: boolean,
        required?: boolean,
    },
}

function CheckboxField(props: ICheckboxFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const onChangeHandler = useCallback(() => {
        props.input.onChange(!props.input?.value);
        if (props.onChange) {
            props.onChange();
        }
    }, [props]);

    const inputProps = useMemo(() => ({
        name: props.input?.name,
        type: props.multiply ? 'checkbox' : 'radio',
        checked: !!props.input?.value,
        onChange: onChangeHandler,
        disabled: props.disabled,
        required: props.required,
        ...props.inputProps,
    }), [onChangeHandler, props.disabled, props.input?.name, props.input?.value, props.inputProps, props.multiply, props.required]);

    const viewProps = useMemo(() => ({
        inputProps,
        color: props.color,
        size: props.size,
        errors: props.errors,
        checked: props.checked,
        className: props.className,
        disabled: props.disabled,
        style: props.style,
        id: props.id,
        label: props.label,
        onChange: props.onChange,
        required: props.required,
    }), [inputProps, props.checked, props.className, props.color, props.disabled,
        props.errors, props.id, props.label, props.onChange, props.required, props.size, props.style]);

    return components.ui.renderView(props.view || 'form.CheckboxFieldView', viewProps);
}

CheckboxField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    inputProps: {},
    multiply: true,
};

export default fieldWrapper<ICheckboxFieldProps>(FieldEnum.CHECKBOX_FIELD, CheckboxField, {label: false});
