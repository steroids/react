import * as React from 'react';
import {field} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';

/**
 * InputField
 * Поле ввода текста
 */
export interface ITimeFieldProps extends IFieldHocInput {
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
    style?: any;

    /**
     * Формат отображения времени
     * @example 'HH:mm'
     */
    timeFormat?: string,

    /**
     * Объект, который будет передан в props внутреннего компонента используемого для выбора времени.
     */
    pickerProps?: any;

    [key: string]: any;
}

export interface ITimeFieldViewProps extends IFieldHocOutput {
    style?: any,
    isInvalid?: boolean,
    errors?: any,
    placeholder?: string,
    timeFormat?: string,
    inputProps: {
        type: string,
        name: string,
        onChange: (value: string) => void,
        value: string | number,
        placeholder: string,
        disabled: string,
    },
    pickerProps: any,
}

interface ITimeFieldPrivateProps extends IFieldHocOutput, IComponentsHocOutput {}

@field({
    componentId: 'form.TimeField'
})
export default class TimeField extends React.PureComponent<ITimeFieldProps & ITimeFieldPrivateProps> {

    static WrappedComponent: any;

    static defaultProps = {
        disabled: false,
        required: false,
        className: '',
        timeFormat: 'HH:mm',
        placeholder: '00:00',
    };

    render() {
        const TimeFieldView = this.props.view || this.props.ui.getView('form.TimeFieldView');
        return (
            <TimeFieldView
                {...this.props}
                inputProps={{
                    type: this.props.type,
                    name: this.props.input.name,
                    placeholder: this.props.placeholder,
                    disabled: this.props.disabled,
                    ...this.props.inputProps,
                    value: this.props.input.value || '',
                    onChange: value => {
                        this.props.input.onChange(value);
                        if (this.props.onChange) {
                            this.props.onChange(value);
                        }
                    },
                }}
            />
        );
    }
}
