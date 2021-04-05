import _get from 'lodash-es/get';
import _cloneDeep from 'lodash-es/cloneDeep';
import {set as _set, delete as _delete} from 'dot-prop-immutable';

import {
    FORM_INITIALIZE,
    FORM_CHANGE,
    FORM_SET_ERRORS,
    FORM_RESET,
    FORM_ARRAY_ADD,
    FORM_ARRAY_REMOVE,
} from '../actions/form';

/**
 * Редьюрес для одной формы. Используется как для Redux, так и для React Reducer
 * @param state
 * @param action
 */
export function reducerItem(state, action) {
    if (!state && action.type !== FORM_INITIALIZE) {
        state = reducerItem(state, {
            type: FORM_INITIALIZE,
            formId: action.formId,
        });
    }

    switch (action.type) {
        case FORM_INITIALIZE:
            return {
                errors: {},
                isInvalid: false,
                isSubmitting: false,
                ...state,
                values: state?.values || _cloneDeep(action.values || {}),
                initialValues: action.values || state?.values || null,
            };

        case FORM_CHANGE:
            return _set(state, 'values.' + action.name, action.value);

        case FORM_SET_ERRORS:
            return _set(state, 'errors', action.errors);

        case FORM_RESET:
            return _set(state, 'values.' + action.name, _cloneDeep(state.initialValues || {}));

        case FORM_ARRAY_ADD:
            // eslint-disable-next-line no-case-declarations
            const newValue = [].concat(_get(state, 'values.' + action.name) || []);
            for (let i = 0; i < action.rowsCount; i += 1) {
                newValue.push(_cloneDeep(action.initialValues || {}));
            }
            return _set(state, 'values.' + action.name, newValue);

        case FORM_ARRAY_REMOVE:
            return _delete(state, 'values.' + action.name + '.' + action.index);

        default:
            return state;
    }
}

const initialState = {};
export default (state = initialState, action) => {
    if (action.formId) {
        state[action.formId] = reducerItem(state[action.formId], action);
    }
    return state;
};

export const formSelector = (state, formId, selector) => selector(state.form?.[formId] || {});
