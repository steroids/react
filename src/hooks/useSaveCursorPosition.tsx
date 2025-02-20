/* eslint-disable max-len */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
import React, {ChangeEvent, useCallback} from 'react';
import _isNull from 'lodash-es/isNull';
import {IInputParams} from '../ui/form/Field/fieldWrapper';
import useDebounce from './useDebounce';

export default function useSaveCursorPosition(
    inputParams: IInputParams,
    onChangeCallback?: (value) => void,
) {
    const [cursor, setCursor] = React.useState(null);
    const inputRef = React.useRef(null);

    React.useEffect(() => {
        const inputElement: HTMLInputElement = inputRef.current;
        if (inputElement) {
            inputElement.setSelectionRange(cursor, cursor);
        }
    }, [cursor, inputParams.value]);

    const onChangeInternal = useCallback((value: any) => inputParams.onChange(value), [inputParams.onChange]);
    const onChangeInternalDebounced = useDebounce(onChangeInternal, inputParams?.delay);

    const onChange = React.useCallback((event: ChangeEvent<HTMLInputElement>, value = null) => {
        if (onChangeCallback) {
            onChangeCallback(value || event.target?.value);
        }

        setCursor(event?.target?.selectionStart);

        const onChangeValue = value || event.target?.value;

        if (inputParams?.isDebounce) {
            onChangeInternalDebounced(onChangeValue);
        } else {
            onChangeInternal(onChangeValue);
        }
    }, [inputParams?.isDebounce, onChangeCallback, onChangeInternal, onChangeInternalDebounced]);

    return {
        inputRef,
        onChange,
    };
}
