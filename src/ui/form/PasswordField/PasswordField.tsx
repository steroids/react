import * as React from 'react';
import {useMemo, useState} from 'react';
import {IInputFieldProps} from '../InputField/InputField';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperOutputProps} from '../Field/fieldWrapper';

/**
 * PasswordField
 * Поле ввода пароля
 */
export interface IPasswordFieldProps extends IInputFieldProps {

    /**
     * Если true, то отображается шкала сложности пароля
     * @example true
     */
    showSecurityBar?: boolean;

    /**
     * Если true, то отображается иконка скрытия/показа пароля
     */
    showSecurityIcon?: boolean;

    [key: string]: any;
}

export interface IPasswordFieldViewProps extends IPasswordFieldProps, IFieldWrapperOutputProps {
    inputProps: {
        type: string,
        name: string,
        onChange: (value: Event | React.ChangeEvent) => void,
        value: string | number,
        placeholder: string,
        disabled: boolean,
    },
    errors?: string[],
    className?: CssClassName,
    onClear?: () => void,
    securityLevel?: 'success' | 'warning' | 'danger',
    onShowPassword: () => void,
    onHidePassword: () => void,
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
    const [type, setType] = useState('password');

    const components = useComponents();

    const onClear = React.useCallback(() => props.input.onChange(''), [props.input]);

    props.inputProps = useMemo(() => ({
        name: props.input.name,
        value: props.input.value || '',
        onChange: e => props.input.onChange(e.target ? e.target.value : e.nativeEvent.text),
        type,
        placeholder: props.placeholder,
        disabled: props.disabled,
        ...props.inputProps,
    }), [props.disabled, props.input, props.inputProps, props.placeholder, type]);
    props.securityLevel = props.showSecurityBar ? checkPassword(props.input.value) : null;
    props.onShowPassword = () => setType('text');
    props.onHidePassword = () => setType('password');
    props.onClear = onClear;

    return components.ui.renderView(props.view || 'form.PasswordFieldView' || 'form.InputFieldView', props);
}

PasswordField.defaultProps = {
    disabled: false,
    showSecurityBar: false,
    showSecurityIcon: true,
    required: false,
    className: '',
    placeholder: '',
    errors: null,
    size: 'md',
};

export default fieldWrapper<IPasswordFieldProps>('PasswordField', PasswordField);
