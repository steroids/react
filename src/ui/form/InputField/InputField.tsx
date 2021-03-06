import * as React from 'react';
import {ChangeEventHandler, ReactNode, useMemo} from 'react';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import {useComponents} from '../../../hooks';
import InputMask from 'react-input-mask';

type IElementInputType = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden'
    | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel'
    | 'text' | 'time' | 'url' | 'week' | string;

/**
 * InputField
 * Поле ввода текста
 */
export interface IInputFieldProps extends IFieldWrapperInputProps {
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
     * Свойства для элемента \<input /\>
     * @example {onKeyDown: ...}
     */
    inputProps?: any;

    /**
     * Дополнительный CSS-класс для элемента отображения
     */
    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: any;

    /**
     */
    viewProps?: any;

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: any;

    /**
     * Изображение или React-нода, которая будет отрендерена слева от поля.
     * @example require('icon.png') | <component/>
     */
    textBefore?: number | ReactNode | string;

    /**
     * Изображение или React-нода, которая будет отрендерена справа от поля.
     * @example require('icon.png') | <component/>
     */
    textAfter?: number | ReactNode | string;

    /**
     * Текст или React-нода, которая будет отрендерена слева от поля.
     * @example 'http://'
     */
    addonBefore?: ReactNode | string;

    /**
     * Текст или React-нода, которая будет отрендерена справа от поля.
     * @example '.com'
     */
    addonAfter?: ReactNode | string;

    /**
     * Конфигурация маски
     * @example { mask: '+7 (999) 999-99-99' }
     */
    maskProps?: any;

    [key: string]: any;
}

export interface IInputFieldViewProps extends IInputFieldProps, IFieldWrapperOutputProps {
    style?: any,
    errors?: string[],
    placeholder?: string,
    type?: string,
    inputProps: {
        type: string,
        name: string,
        onChange: ChangeEventHandler<Element>,
        value: string | number,
        placeholder: string,
        disabled: string,
    },

    textBefore?: number | ReactNode | string,
    textAfter?: number | ReactNode | string,
    addonBefore?: ReactNode | string,
    addonAfter?: ReactNode | string,

    //types for react-input-mask
    maskProps?: any;
    onFocus?: (e: Event | React.FocusEvent) => void,
    onBlur?: (e: Event | React.FocusEvent) => void,
    onMouseDown?: (e: Event | React.MouseEvent) => void;
}

function InputField(props: IInputFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const inputProps = useMemo(() => ({
        type: props.type,
        name: props.input.name,
        value: props.input.value || '',
        onChange: value => props.input.onChange(value),
        placeholder: props.placeholder,
        disabled: props.disabled,
        ...props.inputProps,
    }), [props.disabled, props.input, props.inputProps, props.placeholder, props.type]);

    // No render for hidden input
    if (props.type === 'hidden') {
        return null;
    }

    // react-input-mask HOC for mask
    if (props.maskProps) {
        const maskOnChange = e => props.input.onChange(e.target.value)
        return (
            <InputMask
                {...inputProps}
                {...props.maskProps}
                onChange={maskOnChange}
            >
                {components.ui.renderView(props.view || 'form.InputFieldView', {
                    ...props,
                    ...props.viewProps,
                    inputProps,
                    onChange: maskOnChange,
                })}
            </InputMask>
        );
    }

    return components.ui.renderView(props.view || 'form.InputFieldView', {
        ...props,
        ...props.viewProps,
        inputProps,
    });
}

InputField.defaultProps = {
    type: 'text',
    disabled: false,
    required: false,
    className: '',
    placeholder: '',
    errors: null,
    textBefore: null,
    textAfter: null,
    addonBefore: null,
    addonAfter: null,
};

export default fieldWrapper('InputField', InputField);
