/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
import React from 'react';

const DEFAULT_VALIDITY = __('Неправильный формат адреса электронной почты.');

const useInputTypeEmail = (
    currentInputRef: React.MutableRefObject<HTMLInputElement>,
    onChange: (event: React.ChangeEvent<HTMLInputElement>, value?: any) => void,
    currentValue: string | null | undefined,
) => {
    const isValueEmail = (value: string) => {
        //In that case it's testing if value is empty string or not defined
        if (value === '' || value === null || value === undefined) {
            return false;
        }

        const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegexp.test(value.toLowerCase());
    };

    const errorMessage = isValueEmail(currentValue) ? '' : DEFAULT_VALIDITY;

    React.useEffect(() => {
        currentInputRef.current?.setCustomValidity(errorMessage);
    }, [currentInputRef, currentValue, errorMessage]);

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event);
    };

    return {
        onInputChange,
    };
};

export default useInputTypeEmail;
