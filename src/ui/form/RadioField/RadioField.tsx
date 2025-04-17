import React, {useMemo} from 'react';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import {FieldEnum} from '../../../enums';

/**
 * RadioField
 *
 * Компонент RadioField представляет собой элемент выбора типа "radio". Он позволяет пользователю выбрать один вариант из нескольких предложенных.
 **/
export interface IRadioFieldProps extends IFieldWrapperInputProps, IUiComponent {
    /**
     * Свойства для элемента input
     * @example {onKeyDown: ...}
     */
    inputProps?: any,

    /**
     * Флаг определяющий включен ли элемент
     * @example {'true'}
     */
    checked?: boolean,

    [key: string]: any,
}

export interface IRadioFieldViewProps extends IRadioFieldProps, IFieldWrapperOutputProps {
    inputProps: {
        name: string,
        type: string,
        checked: boolean,
        onChange: (value: string | React.ChangeEvent) => void,
        disabled: boolean,
    },
}

function RadioField(props: IRadioFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const onChangeHandler = React.useCallback(() => {
        props.input.onChange(!props.input.value);
        if (props.onChange) {
            props.onChange();
        }
    }, [props]);

    const inputProps = React.useMemo(() => ({
        name: props.input.name,
        type: 'radio',
        checked: !!props.input.value,
        onChange: onChangeHandler,
        disabled: props.disabled,
        ...props.inputProps,
    }), [onChangeHandler, props.disabled, props.input.name, props.input.value, props.inputProps]);

    const viewProps = useMemo(() => ({
        inputProps,
        errors: props.errors,
        size: props.size,
        className: props.className,
        onChange: props.onChange,
        checked: props.checked,
        disabled: props.disabled,
        required: props.required,
        label: props.label,
    }), [inputProps, props.checked, props.className, props.disabled, props.errors, props.label, props.onChange, props.required, props.size]);

    return components.ui.renderView(props.view || 'form.RadioFieldView', viewProps);
}

RadioField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    inputProps: {},
};

export default fieldWrapper<IRadioFieldProps>(FieldEnum.RADIO_FIELD, RadioField);
