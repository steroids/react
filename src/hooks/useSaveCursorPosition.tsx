/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
import React, {ChangeEvent} from 'react';
import {IInputParams} from 'src/ui/form/Field/fieldWrapper';
import _isNull from 'lodash-es/isNull';

export default function useSaveCursorPosition(
    inputParams: IInputParams,
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
        setCursor(event?.target?.selectionStart);

        inputParams.onChange(value || event.target?.value);
    }, [inputParams]);

    return {
        inputRef,
        onChange,
    };
}