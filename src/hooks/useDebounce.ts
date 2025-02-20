import {useState, useEffect} from 'react';

export default function useDebounce(value: any, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(
        () => {
            const timeoutId = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => {
                clearTimeout(timeoutId);
            };
        },

        [value, delay],
    );

    return debouncedValue;
}
