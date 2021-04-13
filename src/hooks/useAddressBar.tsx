import _get from 'lodash-es/get';
import queryString from 'query-string';
import {replace} from 'connected-react-router';
import _toInteger from 'lodash-es/toInteger';
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

const defaultProps = {
    enable: false,
    useHash: false,
};

export const defaultFromStringConverter = (value, type, item) => {
    type = type || '';

    // Array
    if (type.substr(-2) === '[]') {
        const subType = type.substr(0, type.length - 2);
        return value
            ? value.split(',').map(v => defaultFromStringConverter(v, subType, item))
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
            ? value.join(',')
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

    model.attributes.forEach(item => {
        if (typeof item !== 'string') {
            const converter = item.fromStringConverter || defaultFromStringConverter;
            const value = converter(values[item.attribute] as string, item.type, item);

            if (value !== null || item.defaultValue !== null) {
                result[item.attribute] = value !== null ? value : item.defaultValue;
            }
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
    model.attributes.forEach(item => {
        if (typeof item !== 'string' && values?.[item.attribute] !== item.defaultValue) {
            const converter = item.toStringConverter || defaultToStringConverter;
            const value = converter(values?.[item.attribute], item.type, item);
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
    if (config.enable && !initialQueryRef.current) {
        initialQueryRef.current = queryRestore(config.model, location, config.useHash);
    }

    // Update handler
    const dispatch = useDispatch();
    const updateQuery = useCallback(values => {
        if (config.enable) {
            dispatch(queryReplace(config.model, location, values, config.useHash));
        }
    }, [config.enable, config.model, config.useHash, dispatch, location]);

    // TODO
    return {
        initialQuery: initialQueryRef.current,
        updateQuery,
    };
}
