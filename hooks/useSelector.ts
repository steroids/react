import {useSelector as useReduxSelector} from 'react-redux';

export default function useSelector(selector) {
    return useReduxSelector(selector);
}
