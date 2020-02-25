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
     * Название поля либо отмена отображение поля (false)
     * @example Visible
     */
    label?: string | boolean | any;

    hint?: string; //TODO: не используется, удалить?

    /**
     * Аттрибут (название) поля в форме
     * @example isVisible
     */
    attribute?: string;
    input?: {
        name?: string,
        value?: any,
        onChange?: (...args: any[]) => any
    };

    /**
     * Обязательное ли поле? Если true, то к названию будет добавлен модификатор 'required' - красная звезвочка (по умолчанию)
     * @example true
     */
    required?: boolean;

    /**
     * Есть ли ошибка в поле? Если true, то добавляется класс 'is-invalid' - выделение красным цветом (по умолчанию)
     * @example true
     */
    isInvalid?: boolean;

    /**
     * Переводит чекбокс в состояние "не активен"
     * @example true
     */
    disabled?: boolean;

    inputProps?: any;
    onChange?: (...args: any[]) => any;

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
}

export interface ICheckboxFieldViewProps extends ICheckboxFieldProps, IFieldHocOutput {
    inputProps: {
        name: string,
        type: string,
        checked: boolean,
        onChange: (e: Event) => void,
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
