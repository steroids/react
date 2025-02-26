/* eslint-disable max-len */
import React, {ChangeEvent, useMemo, useCallback} from 'react';
import {IBaseFieldProps, IDebounceConfig} from '../InputField/InputField';
import {useComponents, useSaveCursorPosition} from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import useInputTypeNumber from './hooks/useInputTypeNumber';

const DEFAULT_STEP = 1;

/**
 * NumberField
 *
 * Числовое поле ввода. Этот компонент представляет собой поле ввода для числовых значений.
 **/
export interface INumberFieldProps extends IFieldWrapperInputProps, IBaseFieldProps, IDebounceConfig {
    /**
     * Минимальное значение
     * @example 1
     */
    min?: number,

    /**
     * Максимальное значение
     * @example 100
     */
    max?: number,

    /**
     * Шаг увеличения/уменьшения значения
     * @example 5
     */
    step?: number,

    /**
    * Допустимое количество символов после разделителя
    */
    decimal?: number,

    /**
     * Может ли число быть отрицательным
     */
    isCanBeNegative?: boolean,
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
    inputRef: React.MutableRefObject<any>,
    onStepUp: VoidFunction,
    onStepDown: VoidFunction,
    onKeyDown: VoidFunction,
}

function NumberField(props: INumberFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const {inputRef: currentInputRef, onChange} = useSaveCursorPosition(
        props.input,
        props.onChange,
        props.debounce,
    );

    const step = React.useMemo(() => props.step ?? DEFAULT_STEP, [props.step]);

    const {onInputChange} = useInputTypeNumber(
        currentInputRef,
        {
            max: props.max,
            min: props.min,
            value: props.input.value,
            required: props.required,
        },
        onChange,
        props.decimal,
        props.isCanBeNegative,
    );

    const onStep = useCallback((isIncrement: boolean) => {
        const currentValue = Number(currentInputRef?.current?.value);
        let newValue;

        const fixToDecimal = (value) => props.decimal ? value.toFixed(props.decimal) : value;

        if (isIncrement) {
            newValue = fixToDecimal(currentValue + step);
        } else {
            newValue = fixToDecimal(currentValue - step);
        }

        onChange(null, String(newValue));
    }, [currentInputRef, onChange, props.decimal, step]);

    const onStepUp = useCallback(() => {
        if (!(Number(currentInputRef.current.value) + step > props.max)) {
            onStep(true);
        }
    }, [currentInputRef, onStep, props.max, step]);

    const onStepDown = useCallback(() => {
        if (!(Number(currentInputRef.current.value) - step < props.min)) {
            onStep(false);
        }
    }, [currentInputRef, onStep, props.min, step]);

    const onKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
            onStepUp();
        } else if (event.key === 'ArrowDown') {
            onStepDown();
        }
    }, [onStepDown, onStepUp]);

    const inputProps = useMemo(() => ({
        ...props.inputProps,
        name: props.input.name,
        value: props.input.value ?? '',
        onChange: onInputChange,
        type: 'text',
        min: props.min,
        max: props.max,
        step: props.step,
        placeholder: props.placeholder,
        disabled: props.disabled,
        autoComplete: 'off',
        onKeyDown,
    }), [props.inputProps, props.input.name, props.input.value, props.min, props.max, props.step, props.placeholder, props.disabled, onInputChange, onKeyDown]);

    const viewProps = useMemo(() => ({
        viewProps: props.viewProps,
        inputProps,
        onStepUp,
        onStepDown,
        input: props.input,
        inputRef: currentInputRef,
        size: props.size,
        errors: props.errors,
        className: props.className,
        disabled: props.disabled,
        id: props.id,
    }), [currentInputRef, inputProps, onStepDown, onStepUp, props]);

    return components.ui.renderView(props.view || 'form.NumberFieldView', viewProps);
}

NumberField.defaultProps = {
    disabled: false,
    required: false,
    isCanBeNegative: true,
};

export default fieldWrapper<INumberFieldProps>('NumberField', NumberField);
