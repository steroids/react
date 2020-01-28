import pathToRegexp from 'path-to-regexp';
import queryString from 'query-string';
import _isArray from 'lodash/isArray';
import _isObject from 'lodash/isObject';
import _isBoolean from 'lodash/isBoolean';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import _isFunction from 'lodash/isFunction';
import {initialize} from 'redux-form';
import {push} from 'connected-react-router';

import {getCurrentRoute} from '../../../reducers/navigation';

export default class SyncAddressBarHelper {

    static restore(store, formId, initialValues, forceRestore = false, customizer) {
        let newValues = {
            ...initialValues,
            ...queryString.parse(location.hash),
        };
        if (customizer && _isFunction(customizer)) {
            newValues = customizer(initialValues, queryString.parse(location.hash));
        }
        if (forceRestore || !_isEqual(initialValues, newValues)) {
            store.dispatch(initialize(formId, newValues));
        }
    }

    /**
     * WARNING
     * Method incorrectly saves nested objects (e.g. {foo: [{bar: 1}]}
     * // @todo use 'qs' library instead of 'query-string'
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
        const currentRoute = getCurrentRoute(store.getState() || {});
        if (_isEmpty(values)) {
            if (currentRoute) {
                store.dispatch(
                    push(
                        pathToRegexp.compile(currentRoute.path)(currentRoute.params)
                    )
                );
            } else {
                location.hash = null;
            }
        } else if (currentRoute) {
            store.dispatch(
                push(
                    pathToRegexp.compile(currentRoute.path)(currentRoute.params) + querySeparator + queryString.stringify(values)
                )
            );
        } else {
            location.hash = querySeparator + queryString.stringify(values);
        }
    }
}
