import * as React from 'react';
import { useMemo } from 'react';
import {IInputFieldProps} from '../InputField/InputField';
import { useComponents } from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';

/**
 * NumberField
 * Числовое поле ввода
 */
export interface INumberFieldProps extends IInputFieldProps, IFieldWrapperInputProps {
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

    [key: string]: any;
}

export interface INumberFieldViewProps extends INumberFieldProps, IFieldWrapperOutputProps {
    inputProps: {
        type: string,
        name: string,
        onChange: (value: Event | React.ChangeEvent) => void,
        value: number,
        placeholder: string,
        disabled: boolean,
        min: string | number,
        max: string | number,
        step: string | number,
    },
}

function NumberField(props: INumberFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    props.inputProps = useMemo(() => ({
        name: props.input.name,
        value: props.input.value ?? undefined,
        onChange: e => props.input.onChange(e.target ? e.target.value : e.nativeEvent.text),
        type: 'number',
        min: props.min,
        max: props.max,
        step: props.step,
        placeholder: props.placeholder,
        disabled: props.disabled,
        ...props.inputProps,
    }), [props.disabled, props.input, props.inputProps, props.placeholder, props.min, props.max, props.step]);

    return components.ui.renderView(props.view || 'form.NumberFieldView' || 'form.InputFieldView', props);
}

NumberField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    placeholder: '',
    min: null,
    max: null,
    step: null,
    errors: null,
};

export default fieldWrapper<INumberFieldProps>('NumberField', NumberField);
