import queryString from 'query-string';
import _get from 'lodash-es/get';
import _isObject from 'lodash-es/isObject';
import _isString from 'lodash-es/isString';
import _toInteger from 'lodash-es/toInteger';
import _groupBy from 'lodash-es/groupBy';
import _cloneDeep from 'lodash-es/cloneDeep';
import {replace} from 'connected-react-router';
import {Model} from '../components/MetaComponent';

export const queryConfig = (config, defaultConfig = null) => {
    config = _isObject(config) ? config : {};
    defaultConfig = defaultConfig ? queryConfig(defaultConfig) : {};

    config = _cloneDeep({
        useHash: false,
        attributes: [],
        ...config,
    });

    const defaults = _groupBy(defaultConfig.attributes, 'attribute');
    Object.keys(defaults).forEach(attribute => {
        if (!config.attributes.find(item => item === attribute || item.attribute === attribute)) {
            config.attributes.push(attribute);
        }
    });

    // Normalize attributes
    config.attributes = config.attributes
        .map(item => {
            if (_isString(item)) {
                item = {attribute: item};
            }

            item = {
                type: 'string', // string, string[], number, number[], boolean, boolean[]
                attribute: null,
                defaultValue: null,
                toFormConverter: null,
                toQueryConverter: null,
                ..._get(defaults, [item.attribute, 0]),
                ...item,
            };

            return item;
        })
        .filter(item => !!item.attribute);

    return config;
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
            const value = converter(String(values[item.attribute]), item.type, item);
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
        if (typeof item !== 'string' && values[item.attribute] !== item.defaultValue) {
            const converter = item.toStringConverter || defaultToStringConverter;
            const value = converter(values[item.attribute], item.type, item);
            if (value !== null) {
                result[item.attribute] = value;
            }
        }
    });

    let query = queryString.stringify(result);
    if (useHash) {
        query = '#' + query;
        if (location.hash !== query) {
            location.hash = query;
        }
        return [];
    } else {
        query = '?' + query
        if (location.search !== query) {
            return replace(location.pathname + query);
        }
    }
};
