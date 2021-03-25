import _set from 'lodash-es/set';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
    FORM_INITIALIZE,
    FORM_CHANGE,
    FORM_SET_ERRORS,
    FORM_RESET,
} from '../actions/form';

export const reducerInitialState = {
    values: {},
    initialValues: {},
    errors: {},
    isInvalid: false,
    isSubmitting: false,
};

/**
 * Редьюрес для одной формы. Используется как для Redux, так и для React Reducer
 * @param state
 * @param action
 */
export function reducerItem(state, action) {
    switch (action.type) {
        case FORM_INITIALIZE:
            return {
                ...state,
                errors: {},
                isInvalid: false,
                isSubmitting: false,
                ...state,
                values: _cloneDeep(action.values || {}),
                initialValues: action.values,
            };

        case FORM_CHANGE:
            // TODO Recursive update objects/arrays instances
            //console.log(555, state?.values, action.name, action.value);
            _set(state, ['values'].concat(action.name).join('.'), action.value);
            return {...state};

        case FORM_SET_ERRORS:
            _set(state, 'errors', action.errors);
            return {...state};

        case FORM_RESET:
            _set(state, ['values'].concat(action.name).join('.'), _cloneDeep(state.initialValues));
            return {...state};

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
