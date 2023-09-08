/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
import React, {ChangeEvent} from 'react';
import {IInputParams} from 'src/ui/form/Field/fieldWrapper';
import _isNull from 'lodash-es/isNull';

export default function useSaveCursorPosition(
    inputParams: IInputParams,
    inputRef = null,
    onSelectionStart?: VoidFunction,
    onSelectionEnd?: VoidFunction,
    validators?: ((value: string | number | boolean) => boolean)[],
) {
    const [cursor, setCursor] = React.useState(null);
    const _inputRef = React.useRef(null);
    const currentInputRef: React.MutableRefObject<HTMLInputElement> = inputRef || _inputRef;

    React.useEffect(() => {
        const inputElement: HTMLInputElement = currentInputRef.current;
        if (inputElement) {
            if (onSelectionStart) {
                onSelectionStart();
            }

            inputElement.setSelectionRange(cursor, cursor);

            if (onSelectionEnd) {
                onSelectionEnd();
            }
        }
    }, [currentInputRef, cursor, inputParams.value, onSelectionEnd, onSelectionStart]);

    const onChange = React.useCallback((event: ChangeEvent<HTMLInputElement>, value = null) => {
        setCursor(event?.target.selectionStart);

        if (!validators || validators.every(validator => validator(value || event.target.value))) {
            inputParams.onChange(value || event.target.value);
        }
    }, [inputParams, validators]);

    return {
        inputRef: currentInputRef,
        onChange,
    };
}
