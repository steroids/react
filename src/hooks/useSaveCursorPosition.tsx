/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
import React, {ChangeEvent} from 'react';
import {IInputParams} from 'src/ui/form/Field/fieldWrapper';
import _isNull from 'lodash-es/isNull';

export default function useSaveCursorPosition(
    inputParams: IInputParams,
    validators?: ((value: string | number | boolean) => boolean)[],
) {
    const [cursor, setCursor] = React.useState(null);
    const _inputRef = React.useRef(null);

    React.useEffect(() => {
        const inputElement: HTMLInputElement = _inputRef.current;
        if (inputElement) {
            inputElement.setSelectionRange(cursor, cursor);
        }
    }, [cursor, inputParams.value]);

    const onChange = React.useCallback((event: ChangeEvent<HTMLInputElement>, value = null) => {
        setCursor(event?.target?.selectionStart);

        if (!validators || validators.every(validator => validator(value || event.target?.value))) {
            inputParams.onChange(value || event.target?.value);
        }
    }, [inputParams, validators]);

    return {
        inputRef: _inputRef,
        onChange,
    };
}
