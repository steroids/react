/* eslint-disable max-len */
import {maskitoTransform} from '@maskito/core';
import {maskitoNumberOptionsGenerator} from '@maskito/kit';
import {useMaskito} from '@maskito/react';
import {ISaveCursorPositionDebounceConfig} from '@steroidsjs/core/hooks/useSaveCursorPosition';
import _isNil from 'lodash-es/isNil';
import {ChangeEvent, useEffect, useMemo, useCallback, MutableRefObject, FocusEvent} from 'react';

import {FieldEnum} from '../../../enums';
import {useComponents, useSaveCursorPosition} from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import {IBaseFieldProps} from '../InputField/InputField';

const DEFAULT_STEP = 1;
const DECIMAL_SEPARATOR = '.';
const MINUS_SIGN = '-';

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

    /**
     * Разделитель тысяч (по умолчанию пустая строка — без разделителя, например 1000).
     * Для отображения "1 000" передать пробел: thousandSeparator=" "
     * @example ' '
     * @example ','
     */
    thousandSeparator?: string,
}

export interface INumberFieldViewProps extends INumberFieldProps, IFieldWrapperOutputProps {
    inputProps: {
        type: string,
        name: string,
        onInput: (event: ChangeEvent<HTMLInputElement>, value?: string) => void,
        value: number | string,
        placeholder: string,
        disabled: boolean,
        min: number,
        max: number,
        step: string | number,
        required: boolean,
    },
    inputRef: MutableRefObject<HTMLInputElement | null>,
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
                ...(typeof props.debounce === 'boolean' ? {
                    enabled: props.debounce,
                } : (props.debounce ?? {})),
            },
        },
    );

    const step = useMemo(
        () => props.step ?? DEFAULT_STEP,
        [props.step],
    );

    const isNotEmptyValue = (rawValue: string) => !_isNil(rawValue) && rawValue !== '';

    const numberMaskOptions = useMemo(() => {
        const min = props.min ?? (props.isCanBeNegative ? -Infinity : 0);
        const max = props.max ?? Infinity;

        return maskitoNumberOptionsGenerator({
            min,
            max,
            precision: props.decimal ?? 0,
            decimalSeparator: DECIMAL_SEPARATOR,
            minusSign: MINUS_SIGN,
            thousandSeparator: props.thousandSeparator ?? '',
        });
    }, [props.min, props.max, props.isCanBeNegative, props.decimal, props.thousandSeparator]);

    const maskedInputRef = useMaskito({
        options: numberMaskOptions,
    });

    useEffect(() => {
        if (currentInputRef.current) {
            maskedInputRef(currentInputRef.current);
        }
    }, [currentInputRef, maskedInputRef]);

    useEffect(() => {
        const input = currentInputRef.current;

        const currentValue = props.input.value;

        const hasValue = isNotEmptyValue(currentValue);
        const numberValue = Number(currentValue);

        const isValid = !props.required
            || (hasValue && numberValue >= props.min && numberValue <= props.max);

        input.setCustomValidity(
            isValid ? '' : __('The number is not valid.'),
        );
    }, [currentInputRef, props.required, props.min, props.max, props.input.value, props]);

    const clampToMinMax = useCallback(
        (rawValue: number) => {
            let val = rawValue;

            if (val < props.min) {
                val = props.min;
            }

            if (val > props.max) {
                val = props.max;
            }

            return val;
        },
        [props.min, props.max],
    );

    const onStep = useCallback((isIncrement: boolean) => {
        const currentValue = Number(currentInputRef?.current?.value) || 0;

        const fixToDecimal = (raw: number) => props.decimal
            ? raw.toFixed(props.decimal)
            : String(raw);

        const newValue = isIncrement
            ? currentValue + step
            : currentValue - step;

        onChange(
            null,
            fixToDecimal(clampToMinMax(newValue)),
        );
    }, [currentInputRef, onChange, props.decimal, step, clampToMinMax]);

    const onKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
            onStep(true);
        } else if (event.key === 'ArrowDown') {
            onStep(false);
        }
    }, [onStep]);

    const onBlur = useCallback(
        (event: FocusEvent<HTMLInputElement>) => {
            const rawValue = event.target.value;
            const numberValue = Number(rawValue);
            const shouldApplyMin = !_isNil(props.min) && !Number.isNaN(numberValue) && numberValue < props.min;

            if (shouldApplyMin) {
                onChange(event, String(props.min));
            }
            props.onBlur?.(event);
        },
        [onChange, props],
    );

    const displayValue = useMemo(
        () => isNotEmptyValue(value)
            ? maskitoTransform(String(value), numberMaskOptions)
            : value,
        [value, numberMaskOptions],
    );

    const inputProps = useMemo(() => ({
        type: 'text',
        name: props.input.name,
        value: displayValue,
        onInput: onChange,
        placeholder: props.placeholder,
        min: props.min,
        max: props.max,
        step: props.step,
        disabled: props.disabled,
        required: props.required,
        autoComplete: 'off',
        onKeyDown,
        ...props.inputProps,
    }), [props.inputProps, props.input.name, props.min, props.max, props.step, props.placeholder, props.disabled, props.required, displayValue, onChange, onKeyDown]);

    const viewProps = useMemo(
        () => ({
            viewProps: props.viewProps,
            inputProps,
            onStepUp: () => onStep(true),
            onStepDown: () => onStep(false),
            onBlur,
            input: props.input,
            inputRef: currentInputRef,
            size: props.size,
            errors: props.errors,
            className: props.className,
            disabled: props.disabled,
            id: props.id,
        }),
        [currentInputRef, inputProps, onBlur, onStep, props.className, props.disabled, props.errors, props.id, props.input, props.size, props.viewProps],
    );

    return components.ui.renderView(props.view || 'form.NumberFieldView', viewProps);
}

NumberField.defaultProps = {
    disabled: false,
    required: false,
    isCanBeNegative: true,
};

export default fieldWrapper<INumberFieldProps>(FieldEnum.NUMBER_FIELD, NumberField);
