import React from 'react';

interface IInputTypeNumberProps {
    max: any,
    min: any,
    value: any,

}

const useInputTypeNumber = (
    currentInputRef: React.MutableRefObject<HTMLInputElement>,
    inputTypeNumberProps: IInputTypeNumberProps,
    onChange: (event: React.ChangeEvent<HTMLInputElement>, value?: any) => void,
) => {
    const setValidity = React.useCallback((message: string) => {
        currentInputRef.current?.setCustomValidity(message);
    }, [currentInputRef]);

    const checkIsValueFalsy = (value) => value === '' || value === null || value === undefined;

    React.useEffect(() => {
        const defaultValidity = 'The number is not included in the range';

        // eslint-disable-next-line no-unused-expressions
        inputTypeNumberProps.value > inputTypeNumberProps.max
            || inputTypeNumberProps.value < inputTypeNumberProps.min
            || checkIsValueFalsy(inputTypeNumberProps.value)
            ? setValidity(__(defaultValidity) + ` ${inputTypeNumberProps.min} — ${inputTypeNumberProps.max}`)
            : setValidity('');
    }, [currentInputRef, inputTypeNumberProps.value, inputTypeNumberProps.max, inputTypeNumberProps.min, setValidity]);

    const isValueNumeric = (value) => {
        if (checkIsValueFalsy(value)) {
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
