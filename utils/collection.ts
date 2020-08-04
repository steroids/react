import _isArray from 'lodash-es/isArray';

export const indexBy = (collection, key) => {
    if (!_isArray(collection)) {
        return collection;
    }

    const result = {};
    (collection || []).forEach(item => {
        result[item[key]] = item;
    });
    return result;
}