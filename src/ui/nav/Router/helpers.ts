import _get from 'lodash-es/get';
import _isArray from 'lodash-es/isArray';
import _isObject from 'lodash-es/isObject';
import {IRouteItem} from './Router';

const LEAD_SLASH = '/';

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
    if (!parentPath || parentPath === LEAD_SLASH) {
        return path;
    }

    return `${parentPath}${path.startsWith(LEAD_SLASH) ? '' : LEAD_SLASH}${path}`;
};

const ensureLeadingSlashInPath = (path = '', parentPath = null) => (
    !path.startsWith(LEAD_SLASH) && parentPath ? parentPath + LEAD_SLASH : ''
) + path;

export const walkRoutesRecursive = (
    item: IRouteItem | Record<string, any>,
    defaultItem: any = {},
    parentItem: any = {},
    isChildRouteHasAbsolutePath = false,
) => {
    const normalizedItem = {
        ...defaultItem,
        ...item,
        id: item.id,
        exact: item.exact,
        path: item.path && (
            isChildRouteHasAbsolutePath
                ? ensureLeadingSlashInPath(item.path, parentItem.path)
                : joinChildAndParentPaths(item.path, parentItem.path)
        ),
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
        items = item.items.map(subItem => walkRoutesRecursive(subItem, defaultItem, normalizedItem, isChildRouteHasAbsolutePath));
    } else if (_isObject(item.items)) {
        items = Object.keys(item.items)
            .map(id => walkRoutesRecursive({...item.items[id], id}, defaultItem, normalizedItem, isChildRouteHasAbsolutePath));
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
    isChildRouteHasAbsolutePath = false,
) => {
    if (_isArray(item)) {
        return item;
    }

    // If the children path is not absolute, and it is not a root path, join it with the parent
    if (!isChildRouteHasAbsolutePath && parentItem?.path) {
        item.path = joinChildAndParentPaths(item.path, parentItem.path);
    }

    if (isRoot && !item.id) {
        item.id = 'root';
    }

    let items = item.path ? [item] : [];

    if (_isArray(item.items)) {
        item.items.forEach(subItem => {
            items = items.concat(treeToList(subItem, false, item, isChildRouteHasAbsolutePath));
        });
    } else if (_isObject(item.items)) {
        Object.keys(item.items).forEach(id => {
            items = items.concat(treeToList({...item.items[id], id}, false, item, isChildRouteHasAbsolutePath));
        });
    }

    return items;
};
