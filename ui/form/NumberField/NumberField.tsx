import * as React from 'react';
import {components, field} from '../../../hoc';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface INumberFieldProps extends IFieldHocInput {
    min?: number;
    max?: number;
    step?: string | number;
    placeholder?: string;
    isInvalid?: boolean;
    inputProps?: any;
    className?: string;
    view?: any;
}

export interface INumberFieldViewProps extends IFieldHocOutput {
    inputProps: {
        type: string,
        name: string,
        onChange: (e: Event) => void,
        value: string | number,
        placeholder: string,
        disabled: string,
        min: string | number,
        max: string | number,
        step: string | number,
    },
}

interface INumberFieldPrivateProps extends IFieldHocOutput, IComponentsHocOutput {

}

@field({
    componentId: 'form.NumberField'
})
@components('ui')
export default class NumberField extends React.PureComponent<INumberFieldProps & INumberFieldPrivateProps> {
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
