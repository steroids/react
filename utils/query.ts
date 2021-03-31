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
