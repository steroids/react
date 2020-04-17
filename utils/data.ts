import _uniqBy from 'lodash-es/uniqBy';
import _isString from 'lodash-es/isString';
import _isArray from 'lodash-es/isArray';
import _some from 'lodash-es/some';
import _has from 'lodash-es/has';
import _isObject from 'lodash-es/isObject';
import _isInteger from 'lodash-es/isInteger';
import _isFunction from 'lodash-es/isFunction';

/**
 * Normalize items for save to state. Support enum class or normal items list.
 * @param {array|object} items
 * @returns {*}
 */
export const normalizeItems = (items) => {
    // Array
    if (_isArray(items)) {
        // List of strings/numbers
        if (_some(items, item => _isString(item) || _isInteger(item))) {
            return items.map(item => {
                if (_isString(item) || _isInteger(item)) {
                    return {
                        id: item,
                        label: item
                    };
                }
                return item;
            });
        }
        // Labels as ids
        if (_some(items, item => !_has(item, 'id'))) {
            return _uniqBy(
                items.map(item => {
                    return {
                        id: item.label,
                        ...item
                    };
                }),
                'label'
            );
        }
        return items;
    }
    // Enum
    if (_isObject(items) && _isFunction(items.getLabels)) {
        const labels = items.getLabels();
        return Object.keys(labels).map(id => ({
            id,
            label: labels[id]
        }));
    }
    return [];
};
