import _isPlainObject from 'lodash-es/isPlainObject';
import _isArray from 'lodash-es/isArray';
import _isEqual from 'lodash-es/isEqual';
import _get from 'lodash-es/get';
import {useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState} from 'react';
import {useEffectOnce, useLifecycles, useUpdate} from 'react-use';
import useDispatch from '../hooks/useDispatch';
import {useSelector} from '../hooks';
import {FormContext} from '../ui/form/Form/Form';
import {formChange, formInitialize, formSetErrors} from '../actions/form';
import {reducerItem} from '../reducers/form';

export const setInWithPath = (state: any, value: any, path: string[], pathIndex = 0) => {
    if (pathIndex >= path.length) {
        return value;
    }

    const first = path[pathIndex];
    const firstState = state && (Array.isArray(state) ? state[Number(first)] : state[first]);
    const next = setInWithPath(firstState, value, path, pathIndex + 1);

    if (!state) {
        if (Number.isNaN(first)) {
            return { [first]: next };
        }
        const initialized = [];
        initialized[parseInt(first, 10)] = next;
        return initialized;
    }

    if (Array.isArray(state)) {
        const copy = [].concat(state);
        copy[parseInt(first, 10)] = next;
        return copy;
    }

    return {
        ...state,
        [first]: next,
    };
};

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
                dispatch,
            };
        },
        useField: (formId, name, isList) => {
            const dispatch = useDispatch(); // eslint-disable-line react-hooks/rules-of-hooks
            return {
                ...useSelector(state => {
                    const errors = _get(state, ['form', formId, 'errors'].concat(name.split('.')));
                    const value = _get(state, ['form', formId, 'values'].concat(name.split('.')));
                    return {
                        errors,
                        value: isList ? value?.length || 0 : value,
                    };
                }),
                setValue: useCallback(
                    value => dispatch(formChange(formId, name, value)),
                    [dispatch, formId, name],
                ),
            };
        },
        useDispatch: () => useDispatch(),
        // eslint-disable-next-line react-hooks/rules-of-hooks
        select: (formId, selector) => useSelector(state => selector(_get(state, ['form', formId]))),
    },

    // React reducer
    reducer: {
        useForm: (formId, initialValues) => {
            const initialState = reducerItem({}, formInitialize(formId, initialValues));
            const [state, dispatch] = useReducer(reducerItem, initialState);

            const subscribersRef = useRef([]);
            useEffect(() => {
                subscribersRef.current.forEach(callback => callback(state));
            }, [state]);
            const reducer = useMemo(() => ({
                dispatch,
                select: selector => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const forceUpdate = useUpdate();

                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const valueRef = useRef(selector.call(null, state));

                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const callback = useCallback((newSstate) => {
                        const newValue2 = selector.call(null, newSstate);
                        if (!_isEqual(valueRef.current, newValue2)) {
                            valueRef.current = newValue2;
                            forceUpdate();
                        }
                    }, []); // eslint-disable-line react-hooks/exhaustive-deps
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useLifecycles(
                        () => subscribersRef.current.push(callback),
                        () => {
                            const index = subscribersRef.current.indexOf(callback);
                            if (index !== -1) {
                                subscribersRef.current.splice(index, 1);
                            }
                        },
                    );

                    return valueRef.current;
                },
            }), []); // eslint-disable-line react-hooks/exhaustive-deps

            return {
                ...state,
                setErrors: useCallback(
                    errors => dispatch(formSetErrors(formId, errors)),
                    [dispatch, formId],
                ),
                reducer,
                setState: null,
                dispatch,
            };
        },
        useField: (formId, name, isList) => {
            const {reducer} = useContext(FormContext); // eslint-disable-line react-hooks/rules-of-hooks
            const value = reducer.select(state => _get(state, 'values.' + name));

            return {
                errors: reducer.select(state => _get(state, 'errors.' + name)),
                value: isList ? value?.length || 0 : value,
                setValue: useCallback(
                    newValue => reducer.dispatch(formChange(formId, name, newValue)),
                    [reducer, formId, name],
                ),
            };
        },
        useDispatch: () => useContext(FormContext).reducer.dispatch,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        select: (formId, selector) => useContext(FormContext).reducer.select(selector),
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
