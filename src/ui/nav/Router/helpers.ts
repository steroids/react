import _get from 'lodash-es/get';
import _isArray from 'lodash-es/isArray';
import _isObject from 'lodash-es/isObject';
import {IRouteItem} from './Router';

export const findRedirectPathRecursive = (route: IRouteItem) => {
    if (!route) {
        return null;
    }

    if (typeof route.redirectTo === 'boolean') {
        const key = _isObject(route.items) && !_isArray(route.items) ? Object.keys(route.items)[0] : '0';
        return findRedirectPathRecursive(_get(route, ['items', key]));
    } if (typeof route.redirectTo === 'string') {
        return route.redirectTo;
    }

    return route.path || route.path === ''
        ? route.path
        : null;
};

const joinChildAndParentPaths = (path = '', parentPath = '') => {
    if (!parentPath || parentPath === '/') {
        return path;
    }

    return `${parentPath}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const walkRoutesRecursive = (
    item: IRouteItem | Record<string, any>,
    defaultItem: any = {},
    parentItem: any = {},
    isChildPathJoinedWithParentPath = true,
) => {
    const normalizedItem = {
        ...defaultItem,
        ...item,
        id: item.id,
        exact: item.exact,
        path: item.path && isChildPathJoinedWithParentPath ? item.path : joinChildAndParentPaths(item.path, parentItem.path),
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
        items = item.items.map(subItem => walkRoutesRecursive(subItem, defaultItem, normalizedItem, isChildPathJoinedWithParentPath));
    } else if (_isObject(item.items)) {
        items = Object.keys(item.items)
            .map(id => walkRoutesRecursive({...item.items[id], id}, defaultItem, normalizedItem, isChildPathJoinedWithParentPath));
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
    isChildPathJoinedWithParentPath = true,
) => {
    if (_isArray(item)) {
        return item;
    }

    if (!isChildPathJoinedWithParentPath && parentItem?.path) {
        item.path = joinChildAndParentPaths(item.path, parentItem.path);
    }

    if (isRoot && !item.id) {
        item.id = 'root';
    }

    let items = item.path ? [item] : [];

    if (_isArray(item.items)) {
        item.items.forEach(subItem => {
            items = items.concat(treeToList(subItem, false, item, isChildPathJoinedWithParentPath));
        });
    } else if (_isObject(item.items)) {
        Object.keys(item.items).forEach(id => {
            items = items.concat(treeToList({...item.items[id], id}, false, item, isChildPathJoinedWithParentPath));
        });
    }

    return items;
};
