import {useSelector as useReduxSelector, shallowEqual} from 'react-redux';

export default function useSelector<TState = any, TSelected = any>(
    selector: (state: TState) => TSelected,
): TSelected {
    return useReduxSelector<TState, TSelected>(selector, shallowEqual);
}
