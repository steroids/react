import _isPlainObject from 'lodash-es/isPlainObject';
import componentsMock from './componentsMock';

//TODO import this middleware from StoreComponent
const prepare = (action, dispatch, getState) => {
    // Multiple dispatch (redux-multi)
    if (Array.isArray(action)) {
        return action
            .filter(v => v)
            .map(p => prepare(p, dispatch, getState));
    }
    // Function wraper (redux-thunk)
    if (typeof action === 'function') {
        return action(
            p => prepare(p, dispatch, getState),
            getState,
            componentsMock,
        );
    }
    // Promise, detect errors on rejects
    // Detect action through instanceof Promise is not working in production mode, then used single detection by type
    if (
        typeof action === 'object'
        && typeof action.then === 'function'
        && typeof action.catch === 'function'
    ) {
        return action
            .then(payload => prepare(payload, dispatch, getState))
            .catch(e => {
                throw e;
            });
    }
    // Default case
    if (_isPlainObject(action) && action.type) {
        dispatch(action);
    }
    return action;
};

export default ({getState}) => next => action => prepare(action, next, getState);
