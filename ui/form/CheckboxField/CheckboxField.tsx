import * as React from 'react';
import {components, field} from '../../../hoc';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';

interface ICheckboxFieldProps extends IFieldHocInput {
    label?: string | boolean | any;
    hint?: string;
    attribute?: string;
    input?: {
        name?: string,
        value?: any,
        onChange?: (...args: any[]) => any
    };
    required?: boolean;
    isInvalid?: boolean;
    disabled?: boolean;
    inputProps?: any;
    onChange?: (...args: any[]) => any;
    className?: string;
    view?: any;
    getView?: any;
    ui?: any;
    value?: any;
    dispatch?: any;
}

interface ICheckboxFieldPrivateProps extends IFieldHocOutput, IComponentsHocOutput {

}

@field({
    componentId: 'form.CheckboxField',
    layoutProps: {
        label: false
    }
})
@components('ui')
export default class CheckboxField extends React.PureComponent<ICheckboxFieldProps & ICheckboxFieldPrivateProps> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: ""
    };

    componentDidMount() {
        if (this.props.input.value === undefined) {
            this.props.dispatch(this.props.input.onChange(false));
        }
    }

    render() {
        const CheckboxFieldView =
            this.props.view || this.props.ui.getView('form.CheckboxFieldView');
        return (
            <CheckboxFieldView
                {...this.props}
                inputProps={{
                    name: this.props.input.name,
                    type: 'checkbox',
                    checked: !!this.props.input.value,
                    onChange: () => this.props.input.onChange(!this.props.input.value),
                    disabled: this.props.disabled,
                    ...this.props.inputProps
                }}
            />
        );
    }
}
