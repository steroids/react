import * as React from 'react';
import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';

interface INumberFieldProps {
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
    min?: number;
    max?: number;
    step?: string | number;
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
    componentId: 'form.NumberField'
})
@components('ui')
export default class NumberField extends React.PureComponent<INumberFieldProps,
    {}> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: "",
        placeholder: "",
        min: null,
        max: null,
        step: null,
        errors: []
    };

    render() {
        const NumberFieldView =
            this.props.view ||
            this.props.ui.getView('form.NumberFieldView') ||
            this.props.ui.getView('form.InputFieldView');
        return (
            <NumberFieldView
                {...this.props}
                inputProps={{
                    name: this.props.input.name,
                    value: this.props.input.value || "",
                    onChange: e => this.props.input.onChange(e.target.value),
                    type: 'number',
                    min: this.props.min,
                    max: this.props.max,
                    step: this.props.step,
                    placeholder: this.props.placeholder,
                    disabled: this.props.disabled,
                    ...this.props.inputProps
                }}
            />
        );
    }
}
