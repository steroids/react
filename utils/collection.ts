import _isArray from 'lodash-es/isArray';

// eslint-disable-next-line import/prefer-default-export
export const indexBy = (collection, key) => {
    if (!_isArray(collection)) {
        return collection;
    }

    const result = {};
    (collection || []).forEach(item => {
        result[item[key]] = item;
    });
    return result;
};
