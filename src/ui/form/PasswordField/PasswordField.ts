/* eslint-disable no-unused-expressions */
import {ChangeEvent, useCallback, useMemo, useState} from 'react';
import {IBaseFieldProps} from '../InputField/InputField';
import {useComponents, useSaveCursorPosition} from '../../../hooks';
import fieldWrapper, {IFieldWrapperOutputProps} from '../Field/fieldWrapper';

export enum InputType {
    TEXT = 'text',
    PASSWORD = 'password',
}

/**
 * PasswordField
 *
 * Поле ввода пароля. Этот компонент представляет собой поле ввода для паролей.
 *
 **/
export interface IPasswordFieldProps extends IBaseFieldProps {

    /**
     * Если true, то отображается шкала сложности пароля
     * @example true
     */
    showSecurityBar?: boolean,

    /**
     * Если true, то отображается иконка скрытия/показа пароля
     */
    showSecurityIcon?: boolean,
}

export interface IPasswordFieldViewProps extends IPasswordFieldProps, IFieldWrapperOutputProps {
    inputProps: {
        type: string,
        name: string,
        onChange: (value: Event | ChangeEvent) => void,
        value: string | number,
        placeholder: string,
        disabled: boolean,
    },
    onShowButtonClick: () => void,
    onClear?: () => void,
    securityLevel?: 'success' | 'warning' | 'danger',
}

export const checkPassword = password => {
    if (!password) {
        return null;
    }
    const symbols = {
        lowerLetters: 'qwertyuiopasdfghjklzxcvbnm',
        upperLetters: 'QWERTYUIOPLKJHGFDSAZXCVBNM',
        digits: '0123456789',
        special: '!@#$%^&*()_-+=|/.,:;[]{}',
    };
    let rating = 0;
    Object.keys(symbols).forEach(key => {
        for (let i = 0; i < password.length; i += 1) {
            if (symbols[key].indexOf(password[i]) !== -1) {
                rating += 1;
                break;
            }
        }
    });
    if (password.length > 8 && rating >= 4) {
        return 'success';
    }
    if (password.length >= 6 && rating >= 2) {
        return 'warning';
    }
    return 'danger';
};

function PasswordField(props: IPasswordFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const [type, setType] = useState(InputType.PASSWORD);

    const components = useComponents();
    const {inputRef, onChange} = useSaveCursorPosition(props.input);

    const onClear = useCallback(() => props.input.onChange(''), [props.input]);

    const onShowButtonClick = useCallback(() => {
        type === InputType.PASSWORD ? setType(InputType.TEXT) : setType(InputType.PASSWORD);
    }, [type]);

    const inputProps = useMemo(() => ({
        name: props.input.name,
        defaultValue: props.input.value ?? '',
        placeholder: props.placeholder,
        disabled: props.disabled,
        ref: inputRef,
        onChange,
        type,
        ...props.inputProps,
    }), [inputRef, onChange, props.disabled, props.input.name, props.input.value, props.inputProps, props.placeholder, type]);

    const viewProps = useMemo(() => ({
        viewProps: props.viewProps,
        inputProps,
        securityLevel: props.showSecurityBar ? checkPassword(props.input.value) : null,
        onClear,
        onShowButtonClick,
        size: props.size,
        input: props.input,
        className: props.className,
        showSecurityIcon: props.showSecurityIcon,
        showSecurityBar: props.showSecurityBar,
    }), [inputProps, onClear, onShowButtonClick, props.className, props.input, props.showSecurityBar, props.showSecurityIcon,
        props.size, props.viewProps]);

    return components.ui.renderView(props.view || 'form.PasswordFieldView' || 'form.InputFieldView', viewProps);
}

PasswordField.defaultProps = {
    disabled: false,
    showSecurityBar: false,
    showSecurityIcon: true,
    required: false,
};

export default fieldWrapper<IPasswordFieldProps>('PasswordField', PasswordField);
