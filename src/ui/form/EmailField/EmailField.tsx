/* eslint-disable max-len */
import React from 'react';
import {useComponents, useSaveCursorPosition} from '../../../hooks';
import {IBaseFieldProps} from '../InputField/InputField';
import fieldWrapper, {IFieldWrapperInputProps} from '../Field/fieldWrapper';
import useInputTypeEmail from './hooks/useInputTypeEmail';

/**
 * EmailField
 *
 * Поле ввода почты. Этот компонент представляет собой поле ввода почты.
 *
 **/
export interface IEmailFieldProps extends IBaseFieldProps, IFieldWrapperInputProps { }

function EmailField(props: IEmailFieldProps) {
    const components = useComponents();

    const {inputRef: currentInputRef, onChange} = useSaveCursorPosition(props.input);

    const {onInputChange} = useInputTypeEmail(currentInputRef, onChange, props.input.value);

    const onClear = React.useCallback(() => props.input.onChange(''), [props.input]);

    const inputProps = React.useMemo(() => ({
        name: props.input.name,
        value: props.input.value ?? '',
        onChange: onInputChange,
        type: 'text',
        placeholder: props.placeholder,
        disabled: props.disabled,
        required: props.required,
        ...props.inputProps,
    }), [onInputChange, props.disabled, props.input.name, props.input.value, props.inputProps, props.placeholder, props.required]);

    return components.ui.renderView(props.view || 'form.InputFieldView', {
        ...props,
        inputProps,
        inputRef: currentInputRef,
        onClear,
    });
}

EmailField.defaultProps = {
    size: 'md',
    disabled: false,
    required: false,
    showClear: false,
    maskOptions: null,
};

export default fieldWrapper<IEmailFieldProps>('EmailField', EmailField);
