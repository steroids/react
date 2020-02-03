import * as React from 'react';
import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';

interface IPasswordFieldProps {
    label?: string | boolean;
    hint?: string;
    attribute?: string;
    input?: {
        name?: string,
        value?: any,
        onChange?: (...args: any[]) => any
    };
    required?: boolean;
    size?: 'sm' | 'md' | 'lg';
    security?: boolean;
    placeholder?: string;
    disabled?: boolean;
    isInvalid?: boolean;
    inputProps?: any;
    onChange?: (...args: any[]) => any;
    className?: string;
    view?: any;
    value?: any;
    getView?: any;
    ui?: any;
}

type PasswordFieldState = {
    type?: string
};
@fieldHoc({
    componentId: 'form.PasswordField'
})
@components('ui')
export default class PasswordField extends React.PureComponent<IPasswordFieldProps,
    PasswordFieldState> {
    static defaultProps = {
        disabled: false,
        security: false,
        required: false,
        className: "",
        placeholder: "",
        errors: []
    };

    static checkPassword(password) {
        if (!password) {
            return null;
        }
        const symbols = {
            lowerLetters: 'qwertyuiopasdfghjklzxcvbnm',
            upperLetters: 'QWERTYUIOPLKJHGFDSAZXCVBNM',
            digits: '0123456789',
            special: '!@#$%^&*()_-+=|/.,:;[]{}'
        };
        let rating = 0;
        Object.keys(symbols).map(key => {
            for (let i = 0; i < password.length; i++) {
                if (symbols[key].indexOf(password[i]) !== -1) {
                    rating++;
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
    }

    constructor(props) {
        super(props);
        this.state = {
            type: 'password'
        };
    }

    render() {
        const PasswordFieldView =
            this.props.view ||
            this.props.ui.getView('form.PasswordFieldView') ||
            this.props.ui.getView('form.InputFieldView');
        return (
            <PasswordFieldView
                {...this.props}
                inputProps={{
                    name: this.props.input.name,
                    value: this.props.input.value || "",
                    onChange: e => this.props.input.onChange(e.target.value),
                    type: this.state.type,
                    placeholder: this.props.placeholder,
                    disabled: this.props.disabled,
                    ...this.props.inputProps
                }}
                security={this.props.security}
                securityLevel={
                    this.props.security
                        ? PasswordField.checkPassword(this.props.input.value)
                        : null
                }
                onShowPassword={() => this.setState({type: 'text'})}
                onHidePassword={() => this.setState({type: 'password'})}
            />
        );
    }
}
