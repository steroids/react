import {ChangeEvent, useMemo} from 'react';
import {IBaseFieldProps} from '../InputField/InputField';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperOutputProps} from '../Field/fieldWrapper';

/**
 * NumberField
 *
 * Числовое поле ввода. Этот компонент представляет собой поле ввода для числовых значений.
 **/
export interface INumberFieldProps extends IBaseFieldProps {
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
}

export interface INumberFieldViewProps extends INumberFieldProps, IFieldWrapperOutputProps {
    inputProps: {
        type: string,
        name: string,
        onChange: (value: ChangeEvent<HTMLInputElement> | string) => void,
        value: number,
        placeholder: string,
        disabled: boolean,
        min: number,
        max: number,
        step: string | number,
    },
}

function NumberField(props: INumberFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    props.inputProps = useMemo(() => ({
        name: props.input.name,
        value: props.input.value ?? '',
        onChange: value => props.input.onChange(value),
        type: 'number',
        min: props.min,
        max: props.max,
        step: props.step,
        placeholder: props.placeholder,
        disabled: props.disabled,
        ...props.inputProps,
    }), [props.disabled, props.input, props.inputProps, props.placeholder, props.min, props.max, props.step]);

    return components.ui.renderView(props.view || 'form.NumberFieldView', props);
}

NumberField.defaultProps = {
    disabled: false,
    required: false,
    size: 'md',
};

export default fieldWrapper<INumberFieldProps>('NumberField', NumberField);
