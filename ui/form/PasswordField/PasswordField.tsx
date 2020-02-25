import * as React from 'react';
import {components, field} from '../../../hoc';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IPasswordFieldProps extends IFieldHocInput {
    security?: boolean;
    placeholder?: string;
    isInvalid?: boolean;
    inputProps?: any;
    className?: string;
    view?: any;
}

export interface IPasswordFieldViewProps {
    inputProps: {
        type: string,
        name: string,
        onChange: (e: Event) => void,
        value: string | number,
        placeholder: string,
        disabled: string,
    },
    security?: boolean,
    securityLevel?: 'success' | 'warning' | 'danger',
    onShowPassword: () => void,
    onHidePassword: () => void,
}

interface IPasswordFieldPrivateProps extends IFieldHocOutput, IComponentsHocOutput {

}

interface PasswordFieldState {
    type?: string
}


export const checkPassword = password => {
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
};

@field({
    componentId: 'form.PasswordField'
})
@components('ui')
export default class PasswordField extends React.PureComponent<IPasswordFieldProps & IPasswordFieldPrivateProps, PasswordFieldState> {
    static defaultProps = {
        disabled: false,
        security: false,
        required: false,
        className: '',
        placeholder: '',
        errors: []
    };

    constructor(props) {
        super(props);
        this.state = {
            type: 'password',
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
                    value: this.props.input.value || '',
                    onChange: e => this.props.input.onChange(e.target.value),
                    type: this.state.type,
                    placeholder: this.props.placeholder,
                    disabled: this.props.disabled,
                    ...this.props.inputProps
                }}
                security={this.props.security}
                securityLevel={
                    this.props.security
                        ? checkPassword(this.props.input.value)
                        : null
                }
                onShowPassword={() => this.setState({type: 'text'})}
                onHidePassword={() => this.setState({type: 'password'})}
            />
        );
    }
}
