import _set from 'lodash-es/set';
import _get from 'lodash-es/get';
import _cloneDeep from 'lodash-es/cloneDeep';

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
            // TODO Recursive update objects/arrays instances
            //console.log(555, state?.values, action.name, action.value);
            _set(state, 'values.' + action.name, action.value);
            //return setInWithPath(state, action.value, ['values'].concat(action.name.split('.')));
            return {...state};

        case FORM_SET_ERRORS:
            state.errors = action.errors;
            return state;

        case FORM_RESET:
            _set(state, 'values.' + action.name, _cloneDeep(state.initialValues || {}));
            return {...state};

        case FORM_ARRAY_ADD:
            // eslint-disable-next-line no-case-declarations
            const newValue = [].concat(_get(state, 'values.' + action.name) || []);
            for (let i = 0; i < action.rowsCount; i += 1) {
                newValue.push(_cloneDeep(action.initialValues || {}));
            }
            _set(state, 'values.' + action.name, newValue);
            return {...state};

        case FORM_ARRAY_REMOVE:
            // eslint-disable-next-line no-case-declarations
            const newItems = [].concat(_get(state, 'values.' + action.name) || []);
            newItems.splice(action.index, 1);
            _set(state, 'values.' + action.name, newItems);
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

export const formSelector = (state, formId, selector) => selector(state.form?.[formId] || {});
