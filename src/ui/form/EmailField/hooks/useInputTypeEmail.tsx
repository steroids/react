/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */

import {ChangeEvent, MutableRefObject, useEffect} from 'react';

const DEFAULT_VALIDITY = __('Неправильный формат адреса электронной почты.');

const useInputTypeEmail = (
    currentInputRef: MutableRefObject<HTMLInputElement>,
    onChange: (event: ChangeEvent<HTMLInputElement>, value?: any) => void,
    currentValue: string | null | undefined,
) => {
    const isValueEmail = (value: string) => {
        //In that case it's testing if value is empty string or not defined
        if (!value) {
            return false;
        }

        const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegexp.test(value.toLowerCase());
    };

    const errorMessage = isValueEmail(currentValue) ? '' : DEFAULT_VALIDITY;

    useEffect(() => {
        currentInputRef.current?.setCustomValidity(errorMessage);
    }, [currentInputRef, currentValue, errorMessage]);

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event);
    };

    return {
        onInputChange,
    };
};

export default useInputTypeEmail;
