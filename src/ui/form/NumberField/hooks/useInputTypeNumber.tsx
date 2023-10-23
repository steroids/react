import React from 'react';

interface IInputTypeNumberProps {
    max: any,
    min: any,
    value: string | undefined | null,
}

const useInputTypeNumber = (
    currentInputRef: React.MutableRefObject<HTMLInputElement>,
    inputTypeNumberProps: IInputTypeNumberProps,
    onChange: (event: React.ChangeEvent<HTMLInputElement>, value?: any) => void,
) => {
    React.useEffect(() => {
        const defaultValidity = 'The number is not valid.';

        const errorMessage = inputTypeNumberProps.value > inputTypeNumberProps.max
            || inputTypeNumberProps.value < inputTypeNumberProps.min
            || !inputTypeNumberProps.value
            ? __(defaultValidity)
            : '';

        currentInputRef.current?.setCustomValidity(errorMessage);
    }, [currentInputRef, inputTypeNumberProps.value, inputTypeNumberProps.max, inputTypeNumberProps.min]);

    const isValueNumeric = (value) => {
        if (!value) {
            return true;
        }

        /**
        * Подходят как отрицательные так и положительные числа
        * @example -1
        * @example 1
        */
        const numericRegex = /^-?\d*\.?\d+$/;
        return numericRegex.test(value);
    };

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event?.target?.value;

        if (isValueNumeric(value)) {
            onChange(event);
        }
    };

    return {
        onInputChange,
    };
};

export default useInputTypeNumber;
