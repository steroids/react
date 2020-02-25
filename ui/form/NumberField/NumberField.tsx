import * as React from 'react';
import {components, field} from '../../../hoc';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';


/**
 * NumberField
 * Числовое поле ввода
 */
export interface INumberFieldProps extends IFieldHocInput {
    /**
     * Минимальное значение
     * @example 1
     */
    min?: number;

    /**
     * Максимальное значение
     * @example 100
     */
    max?: number;

    /**
     * Шаг увеличения/уменьшения значения
     * @example 5
     */
    step?: string | number;

    /**
     * Placeholder подсказка
     * @example Your number...
     */
    placeholder?: string;

    /**
     * Есть ли ошибка в поле? Если true, то добавляется класс 'is-invalid' - выделение красным цветом (по умолчанию)
     * @example true
     */
    isInvalid?: boolean;
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
        className: '',
        placeholder: '',
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
                    value: this.props.input.value || '',
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
