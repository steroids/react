import _isNull from 'lodash/isNull';
import React, {ChangeEvent} from 'react';
import {IInputParams} from '../ui/form/Field/fieldWrapper';

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

    const onChange = React.useCallback((event: ChangeEvent<HTMLInputElement>, value = null) => {
        const newValue = _isNull(value) ? event.target?.value : value;
        if (onChangeCallback) {
            onChangeCallback(newValue);
        }

        setCursor(event?.target?.selectionStart);

        inputParams.onChange(newValue);
    }, [inputParams, onChangeCallback]);

    return {
        inputRef,
        onChange,
    };
}
