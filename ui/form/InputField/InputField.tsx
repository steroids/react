import * as React from 'react';
import {components, field} from '../../../hoc';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';

type IElementInputType = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden'
    | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel'
    | 'text' | 'time' | 'url' | 'week' | string;

/**
 * InputField
 * Поле ввода текста
 */
export interface IInputFieldProps extends IFieldHocInput {
    /**
     * HTML Тип
     * @example email
     */
    type?: IElementInputType;

    /**
     * Placeholder подсказка
     * @example Your text...
     */
    placeholder?: string;

    /**
     * Свойства для элемента <input />
     * @example {onKeyDown: ...}
     */
    inputProps?: any;

    /**
     * Дополнительные CSS классы
     * @example my-block
     */
    className?: string;

    /**
     * Переопределение view React компонента для кастомизациии отображения
     * @example MyCustomView
     */
    view?: any;

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: any
}

export interface IInputFieldViewProps extends IFieldHocOutput {
    inputProps: {
        type: string,
        name: string,
        onChange: (e: Event) => void,
        value: string | number,
        placeholder: string,
        disabled: string,
    },
}

interface IInputFieldPrivateProps extends IFieldHocOutput, IComponentsHocOutput {

}

@field({
    componentId: 'form.InputField'
})
@components('ui')
export default class InputField extends React.PureComponent<IInputFieldProps & IInputFieldPrivateProps> {

    static WrappedComponent: any;

    static defaultProps = {
        type: 'text',
        disabled: false,
        required: false,
        className: '',
        placeholder: '',
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
                    type: this.props.type,
                    name: this.props.input.name,
                    value: this.props.input.value || '',
                    //onChange: value => this.props.input.onChange(value),
                    onChange: e => this.props.input.onChange(e.target ? e.target.value : e.nativeEvent.text),
                    placeholder: this.props.placeholder,
                    disabled: this.props.disabled,
                    ...this.props.inputProps
                }}
            />
        );
    }
}
