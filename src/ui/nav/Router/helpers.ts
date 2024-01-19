import _get from 'lodash-es/get';
import _isArray from 'lodash-es/isArray';
import _isObject from 'lodash-es/isObject';
import _isBoolean from 'lodash-es/isBoolean';
import _isString from 'lodash-es/isString';
import {IRouteItem} from './Router';

const SLASH = '/';

const addSlashIfNotPresent = (path = '') => path.startsWith(SLASH) ? path : (SLASH + path);

const joinChildAndParentPaths = (path = '', parentPath = null) => {
    if (!parentPath || parentPath === SLASH) {
        return addSlashIfNotPresent(path);
    }

    return addSlashIfNotPresent(parentPath) + addSlashIfNotPresent(path);
};

const appendChildIfNoSlash = (path = '', parentPath = null) => {
    if (parentPath === SLASH) {
        return addSlashIfNotPresent(path);
    }

    if (!path.startsWith(SLASH)) {
        return addSlashIfNotPresent(parentPath) + addSlashIfNotPresent(path);
    }

    return path;
};

export const findRedirectPathRecursive = (route: IRouteItem, parentPath = '') => {
    if (!route) {
        return null;
    }

    if (_isBoolean(route.redirectTo)) {
        const key = _isObject(route.items) && !_isArray(route.items) ? Object.keys(route.items)[0] : '0';
        return findRedirectPathRecursive(_get(route, ['items', key]), parentPath);
    }

    if (_isString(route.redirectTo)) {
        return route.redirectTo;
    }

    return route.path || route.path === ''
        ? joinChildAndParentPaths(route.path, parentPath)
        : null;
};

export const walkRoutesRecursive = (
    item: IRouteItem | Record<string, any>,
    defaultItem: any = {},
    parentItem: any = {},
    alwaysAppendParentRoutePath = true,
) => {
    const normalizedItem = {
        ...defaultItem,
        ...item,
        id: item.id,
        exact: item.exact,
        path: alwaysAppendParentRoutePath
            ? joinChildAndParentPaths(item.path, parentItem.path)
            : appendChildIfNoSlash(item.path, parentItem.path),
        label: item.label,
        title: item.title,
        isVisible: typeof item.isVisible !== 'undefined'
            ? item.isVisible
            : (typeof parentItem.isVisible !== 'undefined'
                ? parentItem.isVisible
                : defaultItem.isVisible
            ),
        isNavVisible: typeof item.isNavVisible !== 'undefined'
            ? item.isNavVisible
            : (typeof parentItem.isNavVisible !== 'undefined'
                ? parentItem.isNavVisible
                : defaultItem.isNavVisible
            ),
        layout: item.layout || parentItem.layout || defaultItem.layout || null,
        roles: item.roles || parentItem.roles || defaultItem.roles || null,
        component: null,
        componentProps: null,
    };
    let items = null;
    if (_isArray(item.items)) {
        items = item.items.map(subItem => walkRoutesRecursive(subItem, defaultItem, normalizedItem, alwaysAppendParentRoutePath));
    } else if (_isObject(item.items)) {
        items = Object.keys(item.items)
            .map(id => walkRoutesRecursive({
                ...item.items[id],
                id,
            }, defaultItem, normalizedItem, alwaysAppendParentRoutePath));
    }
    return {
        ...normalizedItem,
        items,
    };
};

export const treeToList = (
    item: IRouteItem | Record<string, any>,
    isRoot = true,
    parentItem: any = {},
    alwaysAppendParentRoutePath = true,
) => {
    if (_isArray(item)) {
        return item;
    }

    item.path = alwaysAppendParentRoutePath
        ? joinChildAndParentPaths(item.path, parentItem?.path)
        : appendChildIfNoSlash(item.path, parentItem?.path);

    if (isRoot && !item.id) {
        item.id = 'root';
    }

    let items = item.path ? [item] : [];

    if (_isArray(item.items)) {
        item.items.forEach(subItem => {
            items = items.concat(treeToList(subItem, false, item, alwaysAppendParentRoutePath));
        });
    } else if (_isObject(item.items)) {
        Object.keys(item.items).forEach(id => {
            items = items.concat(treeToList({
                ...item.items[id],
                id,
            }, false, item, alwaysAppendParentRoutePath));
        });
    }

    return items;
};
