import * as React from 'react';
import {submit} from 'redux-form';
import {components, connect, field} from '../../../hoc';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IConnectHocOutput} from '../../../hoc/connect';

export interface ITextFieldProps extends IFieldHocInput {
    /**
     * Placeholder подсказка
     * @example Your text...
     */
    placeholder?: string;

    /**
     * Отправлять форму при нажатии на кнопку `enter`
     * @example true
     */
    submitOnEnter?: boolean;
    inputProps?: any;
    className?: CssClassName;
    view?: CustomView;
}

export interface ITextFieldViewProps extends IFieldHocOutput {
    inputProps: {
        name: string,
        onChange: (value: string | React.ChangeEvent) => void,
        onKeyUp: (e: Event | React.KeyboardEvent) => void,
        value: string | number,
        placeholder: string,
        disabled: boolean,
    },
}

interface ITextFieldPrivateProps extends IFieldHocOutput, IConnectHocOutput, IComponentsHocOutput {

}

@field({
    componentId: 'form.TextField'
})
@connect()
@components('ui')
export default class TextField extends React.PureComponent<ITextFieldProps & ITextFieldPrivateProps> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: '',
        placeholder: '',
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
                    value: this.props.input.value || '',
                    onChange: e => this.props.input.onChange(e.target ? e.target.value : e.nativeEvent.text),
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
