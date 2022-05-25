import _get from 'lodash-es/get';
import _isEmpty from 'lodash-es/isEmpty';
import queryString from 'query-string';
import {replace} from 'connected-react-router';
import _toInteger from 'lodash-es/toInteger';
import _has from 'lodash-es/has';
import _isEqual from 'lodash-es/isEqual';
import {useCallback, useRef} from 'react';
import useSelector from '../hooks/useSelector';
import useDispatch from '../hooks/useDispatch';
import {Model} from '../components/MetaComponent';

export type ListControlPosition = 'top' | 'bottom' | 'both' | string;

export interface IAddressBarConfig {
    enable?: boolean,
    useHash?: boolean,
    model?: Model,
}

export interface IAddressBarOutput {
    initialQuery: Record<string, unknown>,
    updateQuery: (values: Record<string, unknown>) => void,
}

const ARRAY_VALUE_SEPARATOR = '_';

export const defaultFromStringConverter = (value, type, item) => {
    type = type || '';

    // Array
    if (type.substr(-2) === '[]') {
        const subType = type.substr(0, type.length - 2);
        return value
            ? value.split(ARRAY_VALUE_SEPARATOR).map(v => defaultFromStringConverter(v, subType, item))
            : null;
    }

    // Single
    switch (type) {
        case 'number':
            return value || String(value) === '0' ? _toInteger(value) : null;

        case 'boolean':
            return ['1', 't', 'y'].includes(String(value).substr(0, 1)) || null;

        default:
        case 'string':
            return value ? String(value) : null;
    }
};

export const defaultToStringConverter = (value, type, item) => {
    type = type || '';

    // Array
    if (type.substr(-2) === '[]') {
        return value
            ? [].concat(value || []).join(ARRAY_VALUE_SEPARATOR)
            : null;
    }

    // Single
    switch (type) {
        case 'boolean':
            return value ? '1' : null;

        default:
        case 'string':
        case 'number':
            return value ? String(value) : null;
    }
};

export const queryRestore = (model: Model, location, useHash) => {
    const values = queryString.parse(useHash ? location.hash : location.search);
    const result = {};

    const attributes = model?.attributes || Object.keys(values);
    attributes.forEach(item => {
        if (typeof item === 'string') {
            item = {attribute: item};
        }

        const defaultValue = _has(item, 'defaultValue') ? item.defaultValue : null;
        const converter = item.fromStringConverter || defaultFromStringConverter;
        const value = converter(values[item.attribute] as string, item.jsType || 'string', item);

        if (value !== null || defaultValue !== null) {
            result[item.attribute] = value !== null ? value : defaultValue;
        }
    });
    return result;
};

/**
 * WARNING
 * Method incorrectly saves nested objects (e.g. {foo: [{bar: 1}]}
 * // @todo use 'qs' library instead of 'query-string'
 *
 */
export const queryReplace = (model: Model, location, values, useHash) => {
    const result = {};

    const attributes = model?.attributes || Object.keys(values);
    attributes.forEach(item => {
        if (typeof item === 'string') {
            item = {attribute: item};
        }

        const defaultValue = _has(item, 'defaultValue') ? item.defaultValue : null;
        if (values?.[item.attribute] !== defaultValue) {
            const converter = item.toStringConverter || defaultToStringConverter;
            const value = converter(values?.[item.attribute], item.jsType || 'string', item);
            if (value !== null) {
                result[item.attribute] = value;
            }
        }
    });

    let query = queryString.stringify(result);
    if (useHash) {
        // TODO May be window.location?
        query = '#' + query;
        if (location.hash !== query) {
            location.hash = query;
        }
        return [];
    }
    query = '?' + query;
    if (location.search !== query) {
        return replace(location.pathname + query);
    }
    return [];
};

export default function useAddressBar(config: IAddressBarConfig): IAddressBarOutput {
    // Get location from redux
    const location = useSelector(state => _get(state, 'router.location') || null);
    // Initial query
    const initialQueryRef = useRef(null);
    if (!initialQueryRef.current && config.enable) {
        initialQueryRef.current = queryRestore(config.model, location, config.useHash);
    }

    // Update handler
    const dispatch = useDispatch();
    const updateQuery = useCallback(values => {
        if (config.enable) {
            const normalizedValues = Object.keys(values).reduce((obj, key) => {
                const value = values[key];
                const isValidValue = typeof value === 'object'
                    ? !_isEmpty(value)
                    : value !== undefined;
                if (isValidValue) {
                    obj[key] = value;
                }
                return obj;
            }, {});
            if (!_isEqual(initialQueryRef.current, normalizedValues)) {
                initialQueryRef.current = normalizedValues;
                dispatch(queryReplace(config.model, location, normalizedValues, config.useHash));
            }
        }
    }, [config.enable, config.model, config.useHash, dispatch, location]);

    // TODO
    return {
        initialQuery: initialQueryRef.current,
        updateQuery,
    };
}
