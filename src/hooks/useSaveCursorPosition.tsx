/* eslint-disable max-len */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
import React, {ChangeEvent} from 'react';
import _isNull from 'lodash-es/isNull';
import {IInputParams} from '../ui/form/Field/fieldWrapper';

export default function useSaveCursorPosition(
    inputParams: IInputParams,
    onChangeCallback?: (value) => void,
) {
    const [cursor, setCursor] = React.useState(null);
    const inputRef = React.useRef(null);

    React.useEffect(() => {
        const el = inputRef.current as HTMLInputElement | null;
        if (!el || _isNull(cursor)) {
            return;
        }

        const pos = Math.max(0, Math.min(cursor, el.value.length));
        try {
            el.setSelectionRange(pos, pos);
        } catch (e) {
            console.error(e);
        }
    }, [cursor, inputParams.value]);

    const onChange = React.useCallback((event: ChangeEvent<HTMLInputElement>, value = null) => {
        if (onChangeCallback) {
            onChangeCallback(value || event.target?.value);
        }

        setCursor(event?.target?.selectionStart);

        inputParams.onChange(value || event.target?.value);
    }, [inputParams, onChangeCallback]);

    return {
        inputRef,
        onChange,
    };
}
