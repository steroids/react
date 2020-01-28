import React from 'react';
import PropTypes from 'prop-types';

import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';

@fieldHoc({
    componentId: 'form.PasswordField',
})
@components('ui')
export default class PasswordField extends React.PureComponent {

    static propTypes = {
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
        ]),
        hint: PropTypes.string,
        attribute: PropTypes.string,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        required: PropTypes.bool,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        security: PropTypes.bool,
        placeholder: PropTypes.string,
        disabled: PropTypes.bool,
        isInvalid: PropTypes.bool,
        inputProps: PropTypes.object,
        onChange: PropTypes.func,
        className: PropTypes.string,
        view: PropTypes.elementType,
    };

    static defaultProps = {
        disabled: false,
        security: false,
        required: false,
        className: '',
        placeholder: '',
        errors: [], //for storybook
    };

    static checkPassword(password) {
        if (!password) {
            return null;
        }

        const symbols = {
            lowerLetters: 'qwertyuiopasdfghjklzxcvbnm',
            upperLetters: 'QWERTYUIOPLKJHGFDSAZXCVBNM',
            digits: '0123456789',
            special: '!@#$%^&*()_-+=\|/.,:;[]{}',
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

    constructor() {
        super(...arguments);

        this.state = {
            type: 'password',
        };
    }

    render() {
        const PasswordFieldView = this.props.view || this.props.ui.getView('form.PasswordFieldView') || this.props.ui.getView('form.InputFieldView');
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
                    ...this.props.inputProps,
                }}
                security={this.props.security}
                securityLevel={this.props.security ? PasswordField.checkPassword(this.props.input.value) : null}
                onShowPassword={() => this.setState({type: 'text'})}
                onHidePassword={() => this.setState({type: 'password'})}
            />
        );
    }

}
