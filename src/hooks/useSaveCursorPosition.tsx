import React, {ChangeEvent} from 'react';
import {IInputParams} from 'src/ui/form/Field/fieldWrapper';

export default function useSaveCursorPosition(inputParams: IInputParams, inputRef = null) {
    const [cursor, setCursor] = React.useState(null);
    const _inputRef = React.useRef(null);
    const currentInputRef = inputRef || _inputRef;

    React.useEffect(() => {
        const inputElement: HTMLInputElement = currentInputRef.current;
        if (inputElement) {
            inputElement.setSelectionRange(cursor, cursor);
        }
    }, [currentInputRef, cursor, inputParams.value]);

    const onChange = React.useCallback((event: ChangeEvent<HTMLInputElement>, value = null) => {
        setCursor(event.target.selectionStart);
        inputParams.onChange(value || event.target.value);
    }, [inputParams]);

    return {
        inputRef: currentInputRef,
        onChange,
    };
}
