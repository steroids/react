import {useRef, useEffect, useCallback} from 'react';

export default function useDebounceFnVoid<T extends(...args: Parameters<T>) => void>(fn: T, delay = 300): (...args: Parameters<T>) => void {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedFn = useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            fn(...args);
        }, delay);
    }, [delay, fn]);

    useEffect(() => () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    return debouncedFn;
}
