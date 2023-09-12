import React from 'react';

interface IInputProps {
    max: any,
    min: any,
    value: any,

}

export const useNumberField = (
    currentInputRef: React.MutableRefObject<HTMLInputElement>,
    inputProps: IInputProps,
    onChange: (event: React.ChangeEvent<HTMLInputElement>, value?: any) => void,
) => {
    const setValidity = React.useCallback((message: string) => {
        currentInputRef.current?.setCustomValidity(message);
    }, [currentInputRef]);

    React.useEffect(() => {
        const defaultValidity = 'The number is not included in the range';

        // eslint-disable-next-line no-unused-expressions
        inputProps.value > inputProps.max
            || inputProps.value < inputProps.min
            || inputProps.value === ''
            || inputProps.value === null
            || inputProps.value === undefined
            ? setValidity(__(defaultValidity) + ` ${inputProps.min} — ${inputProps.max}`)
            : setValidity('');
    }, [currentInputRef, inputProps.value, inputProps.max, inputProps.min, setValidity]);

    const isValueNumeric = (value) => {
        if (value === '' || value === null || value === undefined) {
            return true;
        }

        const regex = /^-?\d*\.?\d+$/;
        return regex.test(value);
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
