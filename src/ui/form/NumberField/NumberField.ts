/* eslint-disable max-len */
import React, {ChangeEvent, useMemo, useCallback} from 'react';
import {ISaveCursorPositionDebounceConfig} from '@steroidsjs/core/hooks/useSaveCursorPosition';
import {IBaseFieldProps} from '../InputField/InputField';
import {useComponents, useSaveCursorPosition} from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import useInputTypeNumber from './hooks/useInputTypeNumber';
import {FieldEnum} from '../../../enums';

const DEFAULT_STEP = 1;

/**
 * NumberField
 *
 * Числовое поле ввода. Этот компонент представляет собой поле ввода для числовых значений.
 **/
export interface INumberFieldProps extends IFieldWrapperInputProps, IBaseFieldProps {
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

    /**
     * Задержка применения введённого значения
     */
    debounce?: boolean | ISaveCursorPositionDebounceConfig,
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
        required: boolean,
    },
    inputRef: React.MutableRefObject<any>,
    onStepUp: VoidFunction,
    onStepDown: VoidFunction,
    onKeyDown: VoidFunction,
}

function NumberField(props: INumberFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const {
        inputRef: currentInputRef,
        onChange,
        value,
    } = useSaveCursorPosition(
        {
            inputParams: props.input,
            onChangeCallback: props.onChange,
            debounce: {
                enabled: !!props.debounce,
                ...(typeof props.debounce === 'boolean' ? {enabled: props.debounce} : (props.debounce ?? {})),
            },
        },
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

        const fixToDecimal = (rawValue) => props.decimal ? rawValue.toFixed(props.decimal) : rawValue;

        if (isIncrement) {
            newValue = fixToDecimal(currentValue + step);
        } else {
            newValue = fixToDecimal(currentValue - step);
        }

        onInputChange(null, String(newValue));
    }, [currentInputRef, onInputChange, props.decimal, step]);

    const onKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
            onStep(true);
        } else if (event.key === 'ArrowDown') {
            onStep(false);
        }
    }, [onStep]);

    const inputProps = useMemo(() => ({
        ...props.inputProps,
        name: props.input.name,
        value,
        onChange: onInputChange,
        type: 'text',
        min: props.min,
        max: props.max,
        step: props.step,
        placeholder: props.placeholder,
        disabled: props.disabled,
        required: props.required,
        autoComplete: 'off',
        onKeyDown,
    }), [props.inputProps, props.input.name, props.min, props.max, props.step, props.placeholder, props.disabled, props.required, value, onInputChange, onKeyDown]);

    const viewProps = useMemo(() => ({
        viewProps: props.viewProps,
        inputProps,
        onStepUp: () => onStep(true),
        onStepDown: () => onStep(false),
        input: props.input,
        inputRef: currentInputRef,
        size: props.size,
        errors: props.errors,
        className: props.className,
        disabled: props.disabled,
        id: props.id,
    }), [currentInputRef, inputProps, onStep, props.className, props.disabled, props.errors, props.id, props.input, props.size, props.viewProps]);

    return components.ui.renderView(props.view || 'form.NumberFieldView', viewProps);
}

NumberField.defaultProps = {
    disabled: false,
    required: false,
    isCanBeNegative: true,
};

export default fieldWrapper<INumberFieldProps>(FieldEnum.NUMBER_FIELD, NumberField);
