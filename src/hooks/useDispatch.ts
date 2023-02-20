import {Dispatch} from 'react';
import {useDispatch as useReduxDispatch} from 'react-redux';

export default function useDispatch() {
    //@ts-ignore
    return useReduxDispatch<Dispatch<any>>();
}
