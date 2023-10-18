/* eslint-disable no-unneeded-ternary */
/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
import React, {ChangeEvent} from 'react';
import _isNull from 'lodash-es/isNull';
import {IInputParams} from '../ui/form/Field/fieldWrapper';

export const doesSupportSetSelectionRange = (inputElement: HTMLInputElement, inputType: string) => {
    if (!inputElement) {
        return;
    }

    let error;

    try {
        inputElement.setSelectionRange(0, 0);
    } catch (err) {
        if (err instanceof DOMException && err.name === 'InvalidStateError') {
            error = err;
            console.warn(`<InputField /> with "${inputType}" type does not support setSelectionRange() method. Try to use certain UI Component instead.`);
        } else {
            throw err;
        }
    }

    return error ? false : true;
};

export default function useSaveCursorPosition(
    inputParams: IInputParams,
) {
    const [cursor, setCursor] = React.useState(null);
    const inputRef = React.useRef(null);

    React.useEffect(() => {
        const inputElement: HTMLInputElement = inputRef.current;

        doesSupportSetSelectionRange(inputRef.current, inputRef.current.type) ? inputElement.setSelectionRange(cursor, cursor) : null;
    }, [cursor, inputParams.value]);

    const onChange = React.useCallback((event: ChangeEvent<HTMLInputElement>, value = null) => {
        setCursor(event?.target?.selectionStart);

        inputParams.onChange(value || event.target?.value);
    }, [inputParams]);

    return {
        inputRef,
        onChange,
    };
}
