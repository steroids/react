import * as React from 'react';
import {submit} from 'redux-form';
import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';

interface ITextFieldProps {
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
    placeholder?: string;
    isInvalid?: boolean;
    disabled?: boolean;
    submitOnEnter?: boolean;
    inputProps?: any;
    onChange?: (...args: any[]) => any;
    className?: string;
    view?: any;
    formId?: any;
    dispatch?: any;
    getView?: any;
    ui?: any;
}

@fieldHoc({
    componentId: 'form.TextField'
})
@components('ui')
export default class TextField extends React.PureComponent<ITextFieldProps,
    {}> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: "",
        placeholder: "",
        submitOnEnter: false,
        errors: []
    };

    constructor(props) {
        super(props);
        this._onKeyUp = this._onKeyUp.bind(this);
    }

    render() {
        const TextFieldView =
            this.props.view || this.props.ui.getView('form.TextFieldView');
        return (
            <TextFieldView
                {...this.props}
                inputProps={{
                    name: this.props.input.name,
                    value: this.props.input.value || "",
                    onChange: e => this.props.input.onChange(e.target.value),
                    onKeyUp: this._onKeyUp,
                    placeholder: this.props.placeholder,
                    disabled: this.props.disabled,
                    ...this.props.inputProps
                }}
            />
        );
    }

    _onKeyUp(e) {
        if (
            this.props.submitOnEnter &&
            this.props.formId &&
            e.keyCode === 13 &&
            !e.shiftKey
        ) {
            e.preventDefault();
            // TODO This is not worked in redux... =(
            this.props.dispatch(submit(this.props.formId));
        }
    }
}
