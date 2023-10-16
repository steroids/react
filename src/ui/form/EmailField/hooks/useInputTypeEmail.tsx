/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
import React from 'react';
import {checkIsValueFalsy, setCustomValidity} from '../../../../utils/form';

const DEFAULT_VALIDITY = __('Неправильный формат адреса электронной почты.');

const useInputTypeEmail = (
    currentInputRef: React.MutableRefObject<HTMLInputElement>,
    onChange: (event: React.ChangeEvent<HTMLInputElement>, value?: any) => void,
    currentValue: string,
) => {
    const isValueEmail = (value: string) => {
        if (checkIsValueFalsy(value)) {
            return true;
        }

        const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegexp.test(value.toLowerCase());
    };

    React.useEffect(() => {
        isValueEmail(currentValue) ? setCustomValidity(currentInputRef, '') : setCustomValidity(currentInputRef, DEFAULT_VALIDITY);
    }, [currentInputRef, currentValue]);

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event);
    };

    return {
        onInputChange,
    };
};

export default useInputTypeEmail;
