import {useContext} from 'react';
import {ISsr, SsrProviderContext} from '../providers/SsrProvider';

export default function useSsr(): ISsr {
    return useContext(SsrProviderContext);
}
