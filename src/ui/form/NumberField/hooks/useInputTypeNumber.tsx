import {ChangeEvent, MutableRefObject, useEffect} from 'react';

interface IInputTypeNumberProps {
    max: any,
    min: any,
    value: string | undefined | null,
    required?: boolean,
}

const useInputTypeNumber = (
    currentInputRef: MutableRefObject<HTMLInputElement>,
    inputTypeNumberProps: IInputTypeNumberProps,
    onChange: (event: ChangeEvent<HTMLInputElement>, value?: any) => void,
    decimal: number,
    isCanBeNegative?: boolean,
) => {
    useEffect(() => {
        const defaultValidity = __('The number is not valid.');

        const errorMessage = inputTypeNumberProps.required
        && (
            inputTypeNumberProps.value > inputTypeNumberProps.max
            || inputTypeNumberProps.value < inputTypeNumberProps.min
            || !inputTypeNumberProps.value
        )
            ? defaultValidity
            : '';

        currentInputRef.current?.setCustomValidity(errorMessage);
    }, [currentInputRef, inputTypeNumberProps.value, inputTypeNumberProps.max, inputTypeNumberProps.min, inputTypeNumberProps.required]);

    const isValueNumeric = (value) => {
        if (!value) {
            return true;
        }

        const numericFloatRegExp = isCanBeNegative
            /**
             * Подходят отрицательные и положительные числа с плавающей точкой
             * @example -1.0
             * @example 1.1
             */
            ? new RegExp(`^-?\\d*\\.?\\d{0,${decimal}}$`)
            /**
             * Подходят положительные числа с плавающей точкой
             * @example 1.1
             */
            : new RegExp(`^\\d*\\.?\\d{0,${decimal}}$`);

        const numericRegExp = isCanBeNegative
            /**
             * Подходят отрицательные и положительные целые числа
             * @example 1
             * @example -2
             */
            ? new RegExp('^-?\\d*$')
            /**
             * Подходят положительные целые числа
             * @example 1
             */
            : new RegExp('^\\d+$');

        return decimal ? numericFloatRegExp.test(value) : numericRegExp.test(value);
    };

    const onInputChange = (event: ChangeEvent<HTMLInputElement>, newValue?: string) => {
        let value = newValue || event?.target?.value;

        if (isValueNumeric(value)) {
            if (value !== '') {
                const numericValue = Number(value);

                if (numericValue > inputTypeNumberProps.max) {
                    value = inputTypeNumberProps.max;
                } else if (numericValue < inputTypeNumberProps.min) {
                    value = inputTypeNumberProps.min;
                }
            }

            onChange(event, value);
        }
    };

    return {
        onInputChange,
    };
};

export default useInputTypeNumber;
