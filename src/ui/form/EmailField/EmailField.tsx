import {useCallback, useMemo} from 'react';
import {useComponents, useSaveCursorPosition} from '../../../hooks';
import {IBaseFieldProps} from '../InputField/InputField';
import fieldWrapper, {IFieldWrapperInputProps} from '../Field/fieldWrapper';
import useInputTypeEmail from './hooks/useInputTypeEmail';
import {FieldEnum} from '../../../enums';

/**
 * EmailField
 *
 * Поле ввода почты. Этот компонент представляет собой поле ввода почты.
 *
 **/
export interface IEmailFieldProps extends IBaseFieldProps, IFieldWrapperInputProps { }

function EmailField(props: IEmailFieldProps) {
    const components = useComponents();

    const {inputRef: currentInputRef, onChange} = useSaveCursorPosition(
        props.input,
    );

    const {onInputChange} = useInputTypeEmail(currentInputRef, onChange, props.input.value);

    const onClear = useCallback(() => props.input.onChange(''), [props.input]);

    const inputProps = useMemo(() => ({
        name: props.input.name,
        value: props.input.value ?? '',
        onChange: onInputChange,
        type: 'text',
        placeholder: props.placeholder,
        disabled: props.disabled,
        required: props.required,
        ...props.inputProps,
    }), [onInputChange, props.disabled, props.input.name, props.input.value, props.inputProps, props.placeholder, props.required]);

    const viewProps = useMemo(() => ({
        inputProps,
        inputRef: currentInputRef,
        onClear,
        size: props.size,
        errors: props.errors,
        leadIcon: props.leadIcon,
        showClear: props.showClear,
        disabled: props.disabled,
        input: props.input,
        addonAfter: props.addonAfter,
        addonBefore: props.addonBefore,
        textAfter: props.textAfter,
        textBefore: props.textBefore,
        placeholder: props.placeholder,
        required: props.required,
        id: props.id,
        maskOptions: props.maskOptions,
        maskProps: props.maskProps,
        onBlur: props.onBlur,
        onFocus: props.onFocus,
        onMouseDown: props.onMouseDown,
        className: props.className,
        style: props.style,
        viewProps: props.viewProps,
    }), [inputProps, currentInputRef, onClear, props.size, props.errors, props.leadIcon, props.showClear, props.disabled,
        props.input, props.addonAfter, props.addonBefore, props.textAfter, props.textBefore, props.placeholder, props.required,
        props.id, props.maskOptions, props.maskProps, props.onBlur, props.onFocus, props.onMouseDown, props.className, props.style,
        props.viewProps]);

    return components.ui.renderView(props.view || 'form.InputFieldView', viewProps);
}

EmailField.defaultProps = {
    disabled: false,
    required: false,
    showClear: false,
    maskOptions: null,
};

export default fieldWrapper<IEmailFieldProps>(FieldEnum.EMAIL_FIELD, EmailField);
