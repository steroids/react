import {useSelector as useReduxSelector, shallowEqual} from 'react-redux';

export default function useSelector(selector) {
    return useReduxSelector(selector, shallowEqual);
}
