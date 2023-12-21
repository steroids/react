import _uniqBy from 'lodash-es/uniqBy';
import _isString from 'lodash-es/isString';
import _isArray from 'lodash-es/isArray';
import _some from 'lodash-es/some';
import _has from 'lodash-es/has';
import _isObject from 'lodash-es/isObject';
import _isInteger from 'lodash-es/isInteger';
import _isFunction from 'lodash-es/isFunction';
import _every from 'lodash-es/every';

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
                        label: item,
                    };
                }
                return item;
            });
        }
        // Labels as ids
        if (_some(items, item => !_has(item, 'id'))) {
            return _uniqBy(
                items.map(item => ({
                    id: item.label,
                    ...item,
                })),
                'label',
            );
        }
        return items;
    }
    // Enum
    if (_isObject(items) && _isFunction(items.getLabels)) {
        const labels = items.getLabels();
        return Object.keys(labels).map(id => ({
            id,
            label: labels[id],
        }));
    }
    return [];
};

export const checkCondition = (item, condition) => {
    if (_isObject(condition) && !_isArray(condition)) {
        return _every(Object.keys(condition), key => {
            const value = condition[key];
            const operator = _isString(value) ? 'like' : '=';
            return checkCondition(item, [operator, key, value]);
        });
    }
    if (_isArray(condition) && condition.length > 1) {
        const operator = condition[0].toLowerCase();

        // ['not', {role: 'admin'}]
        if (operator.indexOf('not') === 0) {
            const newOperator = operator.replace(/^not\s+/, '');
            return !checkCondition(item, [newOperator].concat(condition.slice(1)));
        }

        const key = condition[1];
        const value = condition[2];
        switch (operator) {
            case '=': // ['=', 'age', 18]
                return item[key] === value;

            case '>': // ['>', 'age', 18]
                return item[key] > value;

            case '>=': // ['>=', 'age', 18]
            case '=>':
                return item[key] >= value;

            case '<': // ['<', 'age', 18]
                return item[key] < value;

            case '<=': // ['<=', 'age', 18]
            case '=<':
                return item[key] <= value;

            case 'and': // ['and', {isActive: true}, ['=', 'name', 'Ivan']]
            case '&&':
                return _every(condition.slice(1), subCondition => checkCondition(item, subCondition));

            case 'or': // ['or', {isAdmin: true}, ['=', 'name', 'Ivan']]
            case '||':
                return _some(condition.slice(1), subCondition => checkCondition(item, subCondition));

            case 'like': // ['like', 'name', 'alex']
                return _isString(item[key]) && item[key].toLowerCase().indexOf(value.toLowerCase()) !== -1;

            case 'between': // ['between', 'size', 5, 10]
                return condition[2] <= value && value <= condition[3];

            case 'in': // ['in', 'ids', [5, 6, 10]]
                return _isArray(item[key]) && item[key].includes(value);

            default:
                throw Error('Wrong operator: ' + operator);
        }
    }
    if (_isFunction(condition)) {
        return !!condition(item);
    }

    return true;
};

export const filterItems = (items: Array<any>, condition: any) => items.filter(item => checkCondition(item, condition));

export const shouldUpdateSingle = (a, b) => {
    if (_isFunction(a) && _isFunction(b)) {
        return false;
    }
    return a !== b;
};

export const shouldUpdate = (objA, objB, deepPaths: any = null) => {
    if (_isObject(objA) && _isObject(objB)) {
        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);
        if (keysA.length !== keysB.length) {
            return true;
        }

        // Convert deep paths to array of arrays
        if (deepPaths) {
            deepPaths = deepPaths.map(p => _isString(p) ? p.split('.') : p);
        }

        for (let i = 0; i < keysA.length; i += 1) {
            const key = keysA[i];
            let deepPath = null;
            if (deepPaths) {
                deepPath = deepPaths.find(p => p[0] === key) || null;
            }

            const hasChanges = deepPath
                ? shouldUpdate(objA[key], objB[key], deepPath)
                : shouldUpdateSingle(objA[key], objB[key]);
            if (hasChanges) {
                // eslint-disable-next-line no-console
                console.log(0, 'shouldUpdate changed key:', key, objA[key], objB[key]);
                return true;
            }
        }
        return false;
    }

    return shouldUpdateSingle(objA, objB);
};
