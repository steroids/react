import pathToRegexp from 'path-to-regexp';
import {matchPath} from 'react-router';
import _get from 'lodash-es/get';
import _isEmpty from 'lodash-es/isEmpty';
import _isEqual from 'lodash-es/isEqual';

import {
    NAVIGATION_INIT_ROUTES,
    NAVIGATION_SET_PARAMS,
    NAVIGATION_ADD_CONFIGS,
    NAVIGATION_REMOVE_CONFIGS,
    NAVIGATION_SET_DATA,
    getConfigId
} from '../actions/navigation';

const initialState = {
    routesTree: null,
    params: {},
    configs: [],
    data: {},
    counters: {},
};
const routesCache = {};

const findRecursive = (items, checkHandler, pathItems) => {
    let finedItem = null;
    (items || []).forEach(item => {
        if (checkHandler(item)) {
            finedItem = item;
        }
        if (!finedItem) {
            finedItem = findRecursive(item.items, checkHandler, pathItems);
            if (finedItem && pathItems) {
                pathItems.push(item);
            }
        }
    });
    return finedItem;
};

const findRecursivePage = (items, pageId, pathItems) => {
    return findRecursive(
        items,
        item => item.id === pageId,
        pathItems
    );
};

const checkActiveRecursive = (pathname, item) => {
    const match = matchPath(pathname, {
        exact: !!item.exact,
        strict: !!item.strict,
        path: item.path,
    });
    if (!match) {
        return !!(item.items || []).find(sub => checkActiveRecursive(pathname, sub));
    }
    return true;
};

const buildNavItem = (state, item, params) => {
    const pathname = location.protocol === 'file:'
        ? location.hash.replace(/^#/, '')
        : _get(state, 'router.location.pathname');
    let url = item.path;
    try {
        url = pathToRegexp.compile(item.path)({
            ...state.navigation.params,
            ...params,
        });
    } catch (e) { // eslint-disable-line no-empty
    }

    return {
        ...item,
        id: item.id,
        title: item.title,
        label: item.label,
        url: url,
        icon: item.icon || null, // you can set icon property to route in routes tree
        isVisible: item.isVisible,
        isActive: checkActiveRecursive(pathname, item),
    };
};


export default (state = initialState, action) => {
    switch (action.type) {
        case NAVIGATION_INIT_ROUTES:
            return {
                ...state,
                routesTree: action.routesTree,
            };

        case NAVIGATION_SET_PARAMS:
            return {
                ...state,
                params: {
                    ...state.params,
                    ...action.params,
                },
            };

        case NAVIGATION_ADD_CONFIGS:
            const configs = [].concat(state.configs);
            const counters = {...state.counters};
            action.configs.forEach(config => {
                const id = getConfigId(config);
                if (counters[id]) {
                    counters[id]++;
                } else {
                    counters[id] = 1;
                    configs.push(config);
                }
            });

            return {
                ...state,
                configs,
                counters,
            };

        case NAVIGATION_REMOVE_CONFIGS:
            let configs2 = [].concat(state.configs);
            const counters2 = {...state.counters};
            action.configs.forEach(config => {
                const id = getConfigId(config);
                if (counters2[id]) {
                    counters2[id]--;

                    if (counters2[id] <= 0) {
                        configs2 = configs2.filter(item => getConfigId(item) !== id);
                    }
                }
            });
            return {
                ...state,
                configs: configs2,
                counters: counters2,
            };

        case NAVIGATION_SET_DATA:
            return {
                ...state,
                data: {
                    ...state.data,
                    [getConfigId(action.config)]: action.data,
                },
            };
    }

    return state;
};

export const isInitialized = state => !!state.navigation.routesTree;

export const getBreadcrumbs = (state, pageId = null, params = {}) => {
    const items = [];
    const root = state.navigation.routesTree;
    if (root) {
        if (root.id !== pageId) {
            const route = findRecursivePage(root.items, pageId, items);
            items.push(root);
            items.reverse();
            items.push(route);
        } else {
            items.push(root);
        }
    }

    return items.filter(item => item.isVisible !== false).map(route => buildNavItem(state, route, params));
};

export const getNavItem = (state, pageId, params = {}) => {
    const route = getRoute(state, pageId);
    return route ? buildNavItem(state, route, params) : null;
};
export const getNavUrl = (state, pageId, params = {}) => {
    const navItem = getNavItem(state, pageId, params);
    return navItem ? navItem.url : '';
};

export const getRoute = (state, pageId) => {
    const root = state.navigation.routesTree;
    if (!root) {
        return null;
    }

    return root.id === pageId ? root : findRecursivePage(root.items, pageId);
};

export const getParentRoute = (state, level = 1) => {
    const currentRoute = getCurrentRoute(state);
    const breadcrumbs = currentRoute && getBreadcrumbs(state, currentRoute.id) || [];

    return breadcrumbs.length > level + 1 ? breadcrumbs[breadcrumbs.length - (level + 1)] : null;
};

export const getCurrentRoute = (state) => {
    if (!state || _isEmpty(state)) {
        return null;
    }

    const root = state.navigation.routesTree;
    if (!root) {
        return null;
    }

    const pathname = location.protocol === 'file:'
        ? location.hash.replace(/^#/, '')
        : _get(state, 'router.location.pathname');
    if (pathname === null) {
        return null;
    }

    let currentRoute = null;
    findRecursive(
        [root],
        item => {
            if (currentRoute) {
                return true;
            }
            const match = matchPath(String(pathname), {
                id: item.id,
                exact: item.exact,
                strict: item.strict,
                path: item.path,
            });
            const finedRoute = match && {id: item.id, ...match};
            if (finedRoute) {
                if (!routesCache[item.id] || !_isEqual(routesCache[item.id], finedRoute)) {
                    routesCache[item.id] = finedRoute;
                }
                currentRoute = routesCache[item.id];
                return true;
            }
            return false;
        }
    );
    return currentRoute;
};

export const getCurrentItem = (state) => {
    const route = getCurrentRoute(state);
    return route && getRoute(state, route.id) || null;
};

export const getCurrentItemParam = (state, param) => {
    const item = getCurrentItem(state);
    return item && item[param] || null;
};

export const getNavItems = (state, parentPageId = null, params = {}) => {
    const route = getRoute(state, parentPageId);

    return route
        ? (route.items || []).filter(item => item.isVisible !== false).map(item => buildNavItem(state, item, params))
        : [];
};

