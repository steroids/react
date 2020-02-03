import * as React from 'react';
import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';

interface IInputFieldProps {
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
    type?:
        | 'button'
        | 'checkbox'
        | 'color'
        | 'date'
        | 'datetime-local'
        | 'email'
        | 'file'
        | 'hidden'
        | 'image'
        | 'month'
        | 'number'
        | 'password'
        | 'radio'
        | 'range'
        | 'reset'
        | 'search'
        | 'submit'
        | 'tel'
        | 'text'
        | 'time'
        | 'url'
        | 'week';
    placeholder?: string;
    isInvalid?: boolean;
    disabled?: boolean;
    inputProps?: any;
    onChange?: (...args: any[]) => any;
    className?: string;
    view?: any;
    getView?: any;
    ui?: any;
}

@fieldHoc({
    componentId: 'form.InputField'
})
@components('ui')
export default class InputField extends React.PureComponent<IInputFieldProps> {

    static WrappedComponent: any;

    static defaultProps = {
        type: 'text',
        disabled: false,
        required: false,
        className: "",
        placeholder: "",
        errors: []
    };

    render() {
        // No render for hidden input
        if (this.props.type === 'hidden') {
            return null;
        }
        const InputFieldView =
            this.props.view || this.props.ui.getView('form.InputFieldView');
        return (
            <InputFieldView
                {...this.props}
                inputProps={{
                    name: this.props.input.name,
                    value: this.props.input.value || "",
                    onChange: e => this.props.input.onChange(e.target.value),
                    type: this.props.type,
                    placeholder: this.props.placeholder,
                    disabled: this.props.disabled,
                    ...this.props.inputProps
                }}
            />
        );
    }
}
