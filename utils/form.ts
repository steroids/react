import {useSelector, useDispatch} from 'react-redux';
import _isPlainObject from 'lodash-es/isPlainObject';
import _isArray from 'lodash-es/isArray';
import _get from 'lodash-es/get';
import {useCallback, useContext, useReducer, useState} from 'react';
import {useEffectOnce} from 'react-use';
import {formChange, formInitialize, formSetErrors} from '../actions/form';
import {reducerItem} from '../reducers/form';
import {FormReducerContext} from '../ui/form/Form/Form';

export const normalizeLayout = layout => (typeof layout === 'object' ? layout : {layout});

export const mergeLayoutProp = (layout1, layout2) => {
    layout1 = layout1 ? normalizeLayout(layout1) : null;
    layout2 = layout2 ? normalizeLayout(layout2) : null;
    return layout1 || layout2 ? {...layout1, ...layout2} : null;
};

export const cleanEmptyObject = object => {
    // if all properties are null substitute the object with null
    if (!Object.values(object).some(x => x)) {
        return null;
    }

    Object.keys(object).forEach(key => {
        if (_isPlainObject(object[key])) {
            object[key] = cleanEmptyObject(object[key]);
        }

        if (_isArray(object[key])) {
            const array = object[key];

            array.forEach((value, index) => {
                if (_isPlainObject(value)) {
                    array[index] = cleanEmptyObject(value);
                }
            });

            if (!object[key].some(x => Boolean(x))) {
                object[key] = [];
            }
        }
    });

    return object;
};

// Form state providers
export const providers = {
    // Redux
    redux: {
        useForm: (formId, initialValues) => {
            const dispatch = useDispatch(); // eslint-disable-line react-hooks/rules-of-hooks
            useEffectOnce(() => { // eslint-disable-line react-hooks/rules-of-hooks
                dispatch(formInitialize(formId, initialValues));
            });
            return {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                ...useSelector(state => _get(state, ['form', formId])),
                setErrors: useCallback(
                    errors => dispatch(formSetErrors(formId, errors)),
                    [dispatch, formId],
                ),
                reducer: null,
                setState: null,
            };
        },
        useField: (formId, name) => {
            const dispatch = useDispatch(); // eslint-disable-line react-hooks/rules-of-hooks
            return {
                ...useSelector(state => ({
                    error: _get(state, ['form', formId, 'errors'].concat(name.split('.'))),
                    value: _get(state, ['form', formId, 'values'].concat(name.split('.'))),
                })),
                setValue: useCallback(
                    value => dispatch(formChange(formId, name, value)),
                    [dispatch, formId, name],
                ),
            };
        },
        // eslint-disable-next-line react-hooks/rules-of-hooks
        select: (formId, selector) => useSelector(state => selector(_get(state, ['form', formId]))),
    },

    // React reducer
    reducer: {
        useForm: (formId, initialValues) => {
            const initialState = reducerItem({}, formInitialize(formId, initialValues));
            const reducer = useReducer(reducerItem, initialState); // eslint-disable-line react-hooks/rules-of-hooks
            const [state, dispatch] = reducer;
            return {
                ...state,
                setErrors: useCallback(
                    errors => dispatch(formSetErrors(formId, errors)),
                    [dispatch, formId],
                ),
                reducer,
                setState: null,
            };
        },
        useField: (formId, name) => {
            const [state, dispatch] = useContext(FormReducerContext); // eslint-disable-line react-hooks/rules-of-hooks
            return {
                error: _get(state, ['errors'].concat(name.split('.'))),
                value: _get(state, ['values'].concat(name.split('.'))),
                setValue: useCallback(
                    value => dispatch(formChange(formId, name, value)),
                    [dispatch, formId, name],
                ),
            };
        },
        select: (formId, selector) => {
            const reducer = useContext(FormReducerContext); // eslint-disable-line react-hooks/rules-of-hooks
            return reducer ? selector(reducer[0]) : null;
        },
    },

    // Local component state
    state: {
        useField: (initialValue) => {
            const [value, setValue] = useState(initialValue); // eslint-disable-line react-hooks/rules-of-hooks
            return {
                error: null,
                value,
                setValue,
            };
        },
    },
};
