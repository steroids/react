import {useRef} from 'react';

export default function useInitial<T>(creator: () => T): T {
    const initialRef = useRef(null);
    if (!initialRef.current) {
        initialRef.current = creator();
    }
    return initialRef.current;
}
