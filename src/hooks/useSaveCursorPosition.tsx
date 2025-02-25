/* eslint-disable max-len */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
import React, {ChangeEvent, useMemo} from 'react';
import _isNull from 'lodash-es/isNull';
import _debounce from 'lodash-es/debounce';
import {IInputParams} from '../ui/form/Field/fieldWrapper';

const DEFAULT_DEBOUNCE_DELAY_MS = 300;

interface IUseSaveCursorDebounceParams extends Partial<IDebounceParams> {
    enabled: boolean,
}

export default function useSaveCursorPosition(
    inputParams: IInputParams,
    onChangeCallback?: (value) => void,
    debounceParams?: IUseSaveCursorDebounceParams,
) {
    const [cursor, setCursor] = React.useState(null);
    const inputRef = React.useRef(null);

    React.useEffect(() => {
        const inputElement: HTMLInputElement = inputRef.current;
        if (inputElement) {
            inputElement.setSelectionRange(cursor, cursor);
        }
    }, [cursor, inputParams.value]);

    const onChange = React.useCallback((event: ChangeEvent<HTMLInputElement>, value = null) => {
        if (onChangeCallback) {
            onChangeCallback(value || event.target?.value);
        }

        setCursor(event?.target?.selectionStart);

        inputParams.onChange(value || event.target?.value);
    }, [inputParams, onChangeCallback]);

    const onChangeWithDelay = useMemo(() => debounceParams?.enabled && _debounce(onChange, debounceParams?.delayMs ?? DEFAULT_DEBOUNCE_DELAY_MS),
        [debounceParams?.enabled, debounceParams?.delayMs, onChange]);

    return {
        inputRef,
        onChange: debounceParams?.enabled ? onChangeWithDelay : onChange,
    };
}
