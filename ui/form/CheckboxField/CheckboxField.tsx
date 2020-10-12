import * as React from 'react';
import {components, connect, field} from '../../../hoc';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IConnectHocOutput} from '../../../hoc/connect';

/**
 * CheckboxField
 * Одиночный чекбокс. Используется в формах для отметки булевого значения.
 */
export interface ICheckboxFieldProps extends IFieldHocInput {

    /**
     * Свойства для элемента \<input /\>
     * @example {onKeyDown: ...}
     */
    inputProps?: any;

    className?: CssClassName;

    view?: CustomView;

    [key: string]: any,
}

export interface ICheckboxFieldViewProps extends ICheckboxFieldProps, IFieldHocOutput {
    inputProps: {
        name: string,
        type: string,
        checked: boolean,
        onChange: (value: string | React.ChangeEvent) => void,
        disabled: boolean,
    }
}

interface ICheckboxFieldPrivateProps extends IFieldHocOutput, IConnectHocOutput, IComponentsHocOutput {

}

@field({
    componentId: 'form.CheckboxField',
    layoutProps: {
        label: false
    }
})
@connect()
@components('ui')
export default class CheckboxField extends React.PureComponent<ICheckboxFieldProps & ICheckboxFieldPrivateProps> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: ''
    };

    static WrappedComponent: any;

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
