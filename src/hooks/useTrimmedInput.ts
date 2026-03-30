import {FocusEvent, useCallback} from 'react';

const getProcessedValue = (value: string, hasAutoTrim?: boolean): string => hasAutoTrim ? value.trim() : value;

export interface ITrimmedInputConfig {
    onChange: (value: string) => void,
    hasAutoTrim?: boolean,
    onBlurCallback?: (e: Event | FocusEvent) => void,
}

export default function useTrimmedInput(config:ITrimmedInputConfig) {
    const onBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
        const processedValue = getProcessedValue(event.target.value, config.hasAutoTrim);
        config.onChange(processedValue);
        config.onBlurCallback?.(event);
    }, [config]);

    const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') {
            return;
        }

        const target = event.target as HTMLInputElement;
        const processedValue = getProcessedValue(target.value, config.hasAutoTrim);

        config.onChange(processedValue);
    }, [config]);

    return {
        onBlur,
        onKeyDown,
    };
}
