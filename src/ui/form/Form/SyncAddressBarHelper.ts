import {compile} from 'path-to-regexp';
import * as queryString from 'qs';
import _isArray from 'lodash-es/isArray';
import _isObject from 'lodash-es/isObject';
import _isBoolean from 'lodash-es/isBoolean';
import _isEmpty from 'lodash-es/isEmpty';
import _isFunction from 'lodash-es/isFunction';
import {push} from 'connected-react-router';
import {getRoute, getRouteParams} from '../../../reducers/router';

export default class SyncAddressBarHelper {
    static restore(
        initialValues,
        customizer = null,
    ) {
        let newValues = {
            ...initialValues,
            ...queryString.parse(window.location.hash),
        };
        if (customizer && _isFunction(customizer)) {
            newValues = customizer(initialValues, queryString.parse(location.hash));
        }
        return newValues;
    }

    /**
     * WARNING
     * Method incorrectly saves nested objects (e.g. {foo: [{bar: 1}]}
     *
     * @param {object} store
     * @param {object} values
     * @param {boolean} useHash
     */
    static save(store, values, useHash = true) {
        values = {...values};
        Object.keys(values).map(key => {
            const value = values[key];
            if (_isObject(value) && !_isArray(value)) {
                delete values[key];
            } else if (_isArray(value)) {
                values[key] = value.join(',');
            } else if (_isBoolean(value)) {
                if (!value) {
                    delete values[key];
                } else {
                    values[key] = 1;
                }
            } else if (value === null) {
                delete values[key];
            }
        });
        const querySeparator = useHash ? '#' : '?';
        const currentRoute = getRoute(store.getState() || {});
        const params = getRouteParams(store.getState() || {});
        if (_isEmpty(values)) {
            if (currentRoute) {
                store.dispatch(
                    push(compile(currentRoute.path)(params)),
                );
            } else {
                location.hash = null;
            }
        } else if (currentRoute) {
            store.dispatch(
                push(
                    compile(currentRoute.path)(params)
                    + querySeparator
                    + queryString.stringify(values),
                ),
            );
        } else {
            location.hash = querySeparator + queryString.stringify(values);
        }
    }

    static cleanValues(values = {}) {
        const obj = {...values};
        Object.keys(obj).forEach(key => {
            if (!obj[key] || (_isArray(obj[key]) && !obj[key].length)) {
                delete obj[key];
            }
        });
        return obj;
    }
}
