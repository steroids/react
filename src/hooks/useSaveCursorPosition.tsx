/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
import _debounce from 'lodash-es/debounce';
import _isNull from 'lodash-es/isNull';
import {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {IInputParams} from '../ui/form/Field/fieldWrapper';

const DEFAULT_DEBOUNCE_DELAY_MS = 300;

export interface ISaveCursorPositionDebounceConfig {
    /**
     * Задержка в мс
     */
    delayMs?: number,
    enabled: boolean,
}

export interface ISaveCursorPositionConfig {
    inputParams: IInputParams,
    onChangeCallback?: (value) => void,
    debounce?: ISaveCursorPositionDebounceConfig,
}

export default function useSaveCursorPosition(config: ISaveCursorPositionConfig) {
    const [cursor, setCursor] = useState(null);
    const inputRef = useRef(null);
    const [localValue, setLocalValue] = useState(config.inputParams.value ?? '');

    useEffect(() => {
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
    }, [cursor, localValue]);

    /**
     * Синхронизация ТОЛЬКО при внешнем reset (например, очистка формы)
     */
    useEffect(() => {
        if (config.inputParams.value !== localValue) {
            setLocalValue(config.inputParams.value ?? '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.inputParams.value]);

    /**
     * Создаём debounce только при смене delay или enabled.
     * onChange и onChangeCallback не добавляем в зависимости,
     * чтобы debounce не пересоздавался каждый рендер.
     */
    const debouncedCommit = useMemo(() => {
        if (!config.debounce?.enabled) {
            return null;
        }

        return _debounce(
            (value: string) => {
                config.inputParams.onChange(value);
                config.onChangeCallback?.(value);
            },
            config.debounce.delayMs ?? DEFAULT_DEBOUNCE_DELAY_MS,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.debounce?.enabled, config.debounce?.delayMs]);

    const onChange = useCallback((event: ChangeEvent<HTMLInputElement>, value = null) => {
        const val = value ?? event.target.value;
        setCursor(event?.target?.selectionStart);
        setLocalValue(val);
        if (config.debounce?.enabled) {
            debouncedCommit(val);
        } else {
            config.inputParams.onChange(val);
            config.onChangeCallback?.(val);
        }
    }, [config, debouncedCommit]);

    return {
        inputRef,
        onChange,
        value: localValue,
    };
}
