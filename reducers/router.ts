import * as React from 'react';
import * as pathToRegexp from 'path-to-regexp';
import {matchPath} from 'react-router';
import * as queryString from 'query-string';
import _get from 'lodash-es/get';
import _isEmpty from 'lodash-es/isEmpty';
import _pick from 'lodash-es/pick';
import _isArray from 'lodash-es/isArray';
import _isObject from 'lodash-es/isObject';
import _isFunction from 'lodash-es/isFunction';
import {
    ROUTER_INIT_ROUTES,
    ROUTER_SET_PARAMS,
    ROUTER_ADD_CONFIGS,
    ROUTER_REMOVE_CONFIGS,
    ROUTER_SET_DATA,
    getConfigId,
} from '../actions/router';

export interface IRoute {
    id?: string,
    title?: string,
    label?: string,
    icon?: string,
    exact?: boolean,
    strict?: boolean,
    path?: string,
    redirectTo?: string,
    isVisible?: boolean,
    isNavVisible?: boolean,
    component?: React.ReactNode,
    componentProps?: object,
    roles?: string[],
    items?: IRoute[],
}

interface IRouterInitialState {
    location: {
        pathname: string,
        search: string,
        hash: string,
        query: object,
    },
    routesTree: IRoute,
    routesMap: {[key: string]: IRoute},
    activeIds: string[],
    match: {
        path: string,
        url: string,
        isExact: string,
        params: object,
    },

    params: object,
    configs: any,
    data: object,
    counters: object,
}

const initialState = {
    location: null,
    routesTree: null,
    routesMap: null,
    activeIds: null,
    currentId: null,
    match: null,

    params: {},
    configs: [],
    data: {},
    counters: {}
} as IRouterInitialState;

/**
 * Generate url for route by path and params
 * @param path
 * @param params
 */
export const buildUrl = (path, params = null) => {
    // Get url
    let url = path;
    let pathKeys = [];
    try {
        pathKeys = pathToRegexp
            .parse(path)
            .slice(1)
            .map((p: any) => p.name);
        url = pathToRegexp.compile(path)({
            ...params,
        });
    } catch (e) {
        // eslint-disable-line no-empty
    }

    // Append params, which keys is not included in path keys
    const queryObj = {};
    Object.keys(params || {})
        .filter(key => !pathKeys.includes(key))
        .forEach(key => {
            queryObj[key] = params[key];
        });
    const query = queryString.stringify(queryObj);
    if (!_isEmpty(query)) {
        url = url + (url.indexOf('?') !== -1 ? '&' : '?') + query;
    }

    return url;
};

/**
 * Normalize routes tree (convert object structure to items[])
 */
const normalizeRoutes = (state, item: IRoute, activeIds: string[], routesMap: object) => {
    let items = null;
    if (_isArray(item.items)) {
        items = item.items.map(subItem => normalizeRoutes(state, subItem, activeIds, routesMap));
    } else if (_isObject(item.items)) {
        items = Object.keys(item.items).map(id => normalizeRoutes(state, {...item.items[id], id}, activeIds, routesMap));
    }
    const normalizedItem = {
        ...item,
        id: item.id,
        title: item.title || item.title === '' ? item.title : item.label,
        label: item.label || item.label === '' ? item.label : item.title,
        icon: item.icon || null,
        exact: !!item.exact,
        strict: !!item.strict,
        path: item.path || '',
        isVisible: item.isVisible !== false,
        isNavVisible: item.isNavVisible !== false,
        component: null, // Do not store component class in redux
        componentProps: null,
        roles: item.roles || [],
        items,
    };

    routesMap[normalizedItem.id] = normalizedItem;
    if (checkIsActive(state, normalizedItem)) {
        activeIds.push(normalizedItem.id);
    }

    return normalizedItem;
};

/**
 * Return true, if item is 'active' - opened current route or it children
 */
const checkIsActive = (state, item) => {
    // Check is active
    const pathname = location.protocol === 'file:'
        ? location.hash.replace(/^#/, '')
        : _get(state, 'location.pathname');
    const checkActive = (pathname, item) => {
        const match = matchPath(pathname, _pick(item, ['exact', 'strict', 'path']));
        return !!(match || (item.items || []).find(sub => checkActive(pathname, sub)));
    };
    return checkActive(pathname, item);
};

/**
 * Find route in routes tree
 */
const findRecursive = (item: IRoute, predicate: string | any, pathItems: IRoute[] | null = null): IRoute | null => {
    if ((_isFunction(predicate) && predicate(item)) || predicate === item.id) {
        if (pathItems) {
            pathItems.push(item);
        }
        return item;
    }

    const finedItem = (item.items || []).find(subItem => findRecursive(subItem, predicate, pathItems)) || null;
    if (finedItem && pathItems) {
        pathItems.push(item);
    }
    return finedItem;
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ROUTER_INIT_ROUTES:
            const routesMap = {};
            const activeIds = [];
            const routesTree = normalizeRoutes(state, action.routes, activeIds, routesMap);
            const currentRoute = activeIds.length > 0 ? routesMap[activeIds[0]] : null;
            return {
                ...state,
                routesTree,
                routesMap,
                activeIds,
                match: currentRoute
                    ? matchPath(String(state.location.pathname), _pick(currentRoute, ['id', 'exact', 'strict', 'path']))
                    : null,
            };

        case '@@router/LOCATION_CHANGE':
            return (() => {
                const activeIds = Object.keys(state.routesMap).filter(id => checkIsActive(state, state.routesMap[id]));
                const currentRoute = activeIds.length > 0 ? state.routesMap[activeIds[0]] : null;
                return {
                    ...state,
                    activeIds,
                    match: currentRoute
                        ? matchPath(String(state.location.pathname), _pick(currentRoute, ['id', 'exact', 'strict', 'path']))
                        : null,
                };
            })();

        case ROUTER_SET_PARAMS:
            return {
                ...state,
                params: {
                    ...state.params,
                    ...action.params
                }
            };

        case ROUTER_ADD_CONFIGS:
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
                counters
            };

        case ROUTER_REMOVE_CONFIGS:
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
                counters: counters2
            };

        case ROUTER_SET_DATA:
            return {
                ...state,
                data: {
                    ...state.data,
                    [getConfigId(action.config)]: action.data
                }
            };
    }
    return state;
};

/*
    Changes from version v1 -> v2

    isInitialized -> isRouterInitialized
    getBreadcrumbs -> getRouteBreadcrumbs
    getNavItem -> getRoute
    getNavUrl -> getRoute + buildNavItem
    getCurrentRoute -> getRoute
    getCurrentItem -> getRoute
    getCurrentItemParam -> getRouteProp
    getNavItems -> getRouteChildren
    getParentRoute -> getRouteParent
 */

export const isRouterInitialized = state => !!state.router.routesTree;
export const getRouterParams = state => _get(state.router, 'params');
export const getActiveRouteIds = state => _get(state.router, 'activeIds') || null;
export const getRouteId = state => _get(state.router, 'activeIds.0') || null;
export const getRoute = (state, routeId = null) => _get(state.router, ['routesMap', routeId || getRouteId(state)]) || null;
export const getRouteProp = (state, routeId = null, param) => _get(getRoute(state, routeId), param) || null;
export const getRouteParams = state => _get(state.router, 'match.params') || null;
export const getRouteParam = (state, param) => _get(getRouteParams(state), param) || null;
export const getRouteBreadcrumbs = (state, routeId = null): IRoute[] => {
    const items = [];
    findRecursive(state.router.routesTree, routeId, items);
    return items.reverse().filter(item => item.isVisible !== false && item.isNavVisible !== false);
};
export const getRouteChildren = (state, routeId = null) => {
    const route = getRoute(state, routeId);
    return route && route.items || null;

};
export const getRouteParent = (state, routeId = null, level = 1) => {
    const route = getRoute(state, routeId);
    const breadcrumbs = route ? getRouteBreadcrumbs(state, route.id) : [];
    return breadcrumbs.length > level + 1
        ? breadcrumbs[breadcrumbs.length - (level + 1)]
        : null;
};
