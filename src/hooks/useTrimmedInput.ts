import {KeyboardEventHandler, useCallback} from 'react';
import * as React from 'react';

const getProcessedValue = (value: string, autoTrim?: boolean): string => autoTrim ? value.trim() : value;

export interface ITrimmedInputConfig {
    onChange: (value: string) => void,
    autoTrim?: boolean,
    onBlurCallback?: (e: Event | React.FocusEvent) => void,
}

export default function useTrimmedInput(config:ITrimmedInputConfig) {
    const onBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        const rawValue = getProcessedValue(event.target.value, config.autoTrim);
        config.onChange(rawValue);
        config.onBlurCallback?.(event);
    }, [config]);

    const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        const rawValue = getProcessedValue(target.value, config.autoTrim);

        if (event.key === 'Enter') {
            config.onChange(rawValue);
        }
    }, [config]);

    return {
        onBlur,
        onKeyDown,
    };
}
