import _get from 'lodash-es/get';
import _isEqual from 'lodash-es/isEqual';
import _cloneDeep from 'lodash-es/cloneDeep';
import _isObject from 'lodash-es/isObject';
import _isEmpty from 'lodash-es/isEmpty';
import {set as _set, delete as _delete} from 'dot-prop-immutable';

import {
    FORM_INITIALIZE,
    FORM_CHANGE,
    FORM_SET_ERRORS,
    FORM_SUBMIT,
    FORM_SET_SUBMITTING,
    FORM_RESET,
    FORM_HARD_RESET,
    FORM_ARRAY_ADD,
    FORM_ARRAY_REMOVE,
    FORM_DESTROY,
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
                values: _cloneDeep(action.values) || state?.values || {},
                initialValues: action.values || state?.values || null,
            };

        case FORM_CHANGE:
            if (_isObject(action.nameOrObject)) {
                const newValues = {
                    ...state.values,
                    ...action.nameOrObject,
                };
                if (!_isEqual(state.values, newValues)) {
                    return {
                        ...state,
                        values: {
                            ...state.values,
                            ...action.nameOrObject,
                        },
                    };
                }
                return state;
            }
            return _set(state, 'values.' + action.nameOrObject, action.value);

        case FORM_SET_ERRORS:
            return {
                ...state,
                errors: action.errors,
                isInvalid: !_isEmpty(action.errors),
            };

        case FORM_SUBMIT:
            return _set(state, 'submitCounter', (state.submitCounter || 0) + 1);

        case FORM_SET_SUBMITTING:
            return _set(state, 'isSubmitting', action.isSubmitting);

        case FORM_RESET:
            return {
                ...state,
                values: _cloneDeep(state.initialValues || {}),
            };

        case FORM_HARD_RESET:
            return {
                ...state,
                initialValues: null,
                values: {},
                errors: {},
                isInvalid: false,
                isSubmitting: false,
            };

        case FORM_DESTROY:
            return null;

        case FORM_ARRAY_ADD:
            // eslint-disable-next-line no-case-declarations
            if (action.name) {
                const newValue = [].concat(_get(state, 'values.' + action.name) || []);
                for (let i = 0; i < action.rowsCount; i += 1) {
                    newValue.push(_cloneDeep(action.initialValues || {}));
                }
                return _set(state, 'values.' + action.name, newValue);
            }
            return state;

        case FORM_ARRAY_REMOVE:
            return _delete(state, 'values.' + action.name + '.' + action.index);

        default:
            return state;
    }
}

const initialState = {};
export default (state = initialState, action) => {
    if (action.formId) {
        return _set(state, action.formId, reducerItem(state[action.formId], action));
    }
    return state;
};

export const formSelector = (state, formId, selector) => selector(state.form?.[formId] || {});
export const getFormValues = (state, formId) => state.form?.[formId]?.values || null;
