/* eslint-disable max-len */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
import React, {ChangeEvent, useMemo} from 'react';
import _debounce from 'lodash-es/debounce';
import {IInputParams} from '../ui/form/Field/fieldWrapper';

const DEFAULT_DEBOUNCE_DELAY_MS = 300;

export interface IDebounceConfig {
    /**
     * Задержка в мс
     */
    delayMs: number,
}

export interface ISaveCursorPositionDebounceConfig extends Partial<IDebounceConfig> {
    enabled: boolean,
}

export interface ISaveCursorPositionConfig {
    inputParams: IInputParams,
    onChangeCallback?: (value) => void,
    debounce?: ISaveCursorPositionDebounceConfig,
}

export default function useSaveCursorPosition(config: ISaveCursorPositionConfig) {
    const [cursor, setCursor] = React.useState(null);
    const inputRef = React.useRef(null);

    React.useEffect(() => {
        const inputElement: HTMLInputElement = inputRef.current;
        if (inputElement) {
            inputElement.setSelectionRange(cursor, cursor);
        }
    }, [cursor, config.inputParams.value]);

    const onChange = React.useCallback((event: ChangeEvent<HTMLInputElement>, value = null) => {
        if (config.onChangeCallback) {
            config.onChangeCallback(value || event.target?.value);
        }

        setCursor(event?.target?.selectionStart);

        config.inputParams.onChange(value || event.target?.value);
    }, [config.inputParams, config.onChangeCallback]);

    const onChangeWithDelay = useMemo(
() => config.debounce?.enabled
            && _debounce(onChange, config.debounce?.delayMs ?? DEFAULT_DEBOUNCE_DELAY_MS),
    [config.debounce, onChange],
);

    return {
        inputRef,
        onChange: config.debounce?.enabled ? onChangeWithDelay : onChange,
    };
}
