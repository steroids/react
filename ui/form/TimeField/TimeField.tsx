import * as React from 'react';
import { useMemo } from 'react';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import useField, { defineField } from '../../../hooks/field';
import { useComponents } from '../../../hooks';

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
     * Свойства для элемента \<input /\>
     * @example {onKeyDown: ...}
     */
    inputProps?: any;
    className?: CssClassName;

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
    type: any,
}

interface ITimeFieldPrivateProps extends IFieldHocOutput, IComponentsHocOutput {}

function TimeField(props: ITimeFieldProps & ITimeFieldPrivateProps) {
    props = useField('TimeField', props);

    const components = useComponents();

    props.inputProps = useMemo(() => ({
        type: props.type,
        name: props.input.name,
        placeholder: props.placeholder,
        disabled: props.disabled,
        ...props.inputProps,
        value: props.input.value || '',
        onChange: value => {
            props.input.onChange(value);
            if (props.onChange) {
                props.onChange(value);
            }
        },
    }), [props.disabled, props.input, props.inputProps, props.placeholder]);

    return components.ui.renderView(props.view || 'form.TimeFieldView', props);
}

TimeField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    timeFormat: 'HH:mm',
    placeholder: '00:00',
};

export default defineField('TimeField')(TimeField);
