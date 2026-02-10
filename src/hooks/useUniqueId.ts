import _uniqueId from 'lodash-es/uniqueId';
import {useRef} from 'react';

export default function useUniqueId(prefix: string) {
    const idRef = useRef<string>('');
    if (!idRef.current) {
        idRef.current = _uniqueId(prefix);
    }
    return idRef.current;
}
