/* eslint-disable max-len */
import React, {ChangeEvent, useMemo, useCallback, useRef} from 'react';
import {IBaseFieldProps} from '../InputField/InputField';
import {useComponents, useSaveCursorPosition} from '../../../hooks';
import fieldWrapper, {IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import useInputTypeNumber from './hooks/useInputTypeNumber';

const DEFAULT_STEP = 1;

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
    step?: number;
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

    const {inputRef: currentInputRef, onChange} = useSaveCursorPosition(props.input);

    const step = React.useMemo(() => props.step ?? DEFAULT_STEP, [props.step]);

    const {onInputChange} = useInputTypeNumber(
        currentInputRef,
        {
            max: props.max,
            min: props.min,
            value: props.input.value,
        },
        onChange,
    );

    const onStep = useCallback((isIncrement: boolean) => {
        onChange(null, String(Number(currentInputRef?.current?.value) + (isIncrement ? step : -step)));
    }, [currentInputRef, onChange, step]);

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
        ...props.inputProps,
    }), [props.input.name, props.input.value, props.min, props.max, props.step, props.placeholder, props.disabled, props.inputProps, onInputChange, onKeyDown]);

    return components.ui.renderView(props.view || 'form.NumberFieldView', {
        ...props,
        inputProps,
        onStepUp,
        onStepDown,
        inputRef: currentInputRef,
    });
}

NumberField.defaultProps = {
    disabled: false,
    required: false,
    size: 'md',
};

export default fieldWrapper<INumberFieldProps>('NumberField', NumberField);
