import * as React from 'react';
import {parse, compile} from 'path-to-regexp';
import {matchPath} from 'react-router';
import * as queryString from 'qs';
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
    componentProps?: Record<string, unknown>,
    roles?: string[],
    items?: IRoute[],

    [key: string]: any,
}

interface IRouterInitialState {
    location: {
        pathname: string,
        search: string,
        hash: string,
        query: Record<string, unknown>,
    },
    routesTree: IRoute,
    routesMap: { [key: string]: IRoute },
    activeIds: string[],
    match: {
        path: string,
        url: string,
        isExact: string,
        params: Record<string, unknown>,
    },

    params: Record<string, unknown>,
    configs: any,
    data: Record<string, unknown>,
    counters: Record<string, unknown>,
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
    counters: {},
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
        pathKeys = parse(path)
            .slice(1)
            .map((p: any) => p.name);
        url = compile(path)({
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
    if (!_isEmpty(query) && url) {
        url = url + (url.indexOf('?') !== -1 ? '&' : '?') + query;
    }

    return url;
};

/**
 * Return true, if item is 'active' - opened current route or it children
 */
const checkIsActive = (state, item) => {
    // Check is active
    const pathname = window.location.protocol === 'file:'
        ? window.location.hash.replace(/^#/, '')
        : _get(state, 'location.pathname');
    const checkActive = (subPathname, subItem) => {
        const match = matchPath(subPathname, _pick(subItem, ['exact', 'strict', 'path']));
        return !!(match || (subItem.items || []).find(sub => checkActive(subPathname, sub)));
    };
    return checkActive(pathname, item);
};

/**
 * Normalize routes tree (convert object structure to items[])
 */
const normalizeRoutes = (state, item: IRoute, activeIds: string[], routesMap: Record<string, unknown>) => {
    let items = null;
    if (_isArray(item.items)) {
        items = item.items.map(subItem => normalizeRoutes(state, subItem, activeIds, routesMap));
    } else if (_isObject(item.items)) {
        items = Object.keys(item.items)
            .map(id => normalizeRoutes(state, {...item.items[id], id}, activeIds, routesMap));
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

const getMatch = (currentRoute, state) => {
    const match = currentRoute
        ? matchPath(String(state.location.pathname), _pick(currentRoute, ['id', 'exact', 'strict', 'path']))
        : null;

    return match && {
        ...match,
        params: {
            ...state.location.query,
            ...match.params,
        },
    };
};

const reducerMap = {
    [ROUTER_INIT_ROUTES]: (state, action) => {
        const routesMap = {};
        const activeIds = [];
        const routesTree = normalizeRoutes(state, action.routes, activeIds, routesMap);
        const currentRoute = activeIds.length > 0 ? routesMap[activeIds[0]] : null;
        return {
            ...state,
            routesTree,
            routesMap,
            activeIds,
            match: getMatch(currentRoute, state),
        };
    },
    '@@router/LOCATION_CHANGE': (state, action) => {
        const activeIds = Object.keys(state.routesMap).filter(id => checkIsActive(state, state.routesMap[id]));
        const currentRoute = activeIds.length > 0 ? state.routesMap[activeIds[0]] : null;
        return {
            ...state,
            activeIds,
            match: getMatch(currentRoute, state),
        };
    },
    [ROUTER_SET_PARAMS]: (state, action) => ({
        ...state,
        params: {
            ...state.params,
            ...state.location.query,
            ...action.params,
        },
    }),
    [ROUTER_ADD_CONFIGS]: (state, action) => {
        const configs = [].concat(state.configs || []);
        const counters = {...state.counters};
        action.configs.forEach(config => {
            const id = getConfigId(config);
            if (counters[id]) {
                counters[id] += 1;
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
    },
    [ROUTER_REMOVE_CONFIGS]: (state, action) => {
        let configs2 = [].concat(state.configs);
        const counters2 = {...state.counters};
        const data = {...state.data};
        action.configs.forEach(config => {
            const id = getConfigId(config);
            if (counters2[id]) {
                counters2[id] -= 1;
                if (counters2[id] <= 0) {
                    configs2 = configs2.filter(item => getConfigId(item) !== id);
                    delete data[id];
                }
            }
        });
        return {
            ...state,
            data,
            configs: configs2,
            counters: counters2,
        };
    },
    [ROUTER_SET_DATA]: (state, action) => ({
        ...state,
        data: {
            ...state.data,
            [getConfigId(action.config)]: action.data,
        },
    }),
};
export default (state = initialState, action) => reducerMap[action] ? reducerMap[action](state, action) : state;

export const isRouterInitialized = state => !!state.router.routesTree;
export const getRouterParams = state => _get(state.router, 'params');
export const getActiveRouteIds = state => _get(state.router, 'activeIds') || null;
export const getRoutesMap = state => _get(state.router, 'routesMap') || null;
export const getRouteId = state => _get(state.router, 'activeIds.0') || null;
export const getRoute = (state, routeId = null) => _get(
    state.router, ['routesMap', routeId || getRouteId(state)],
) || null;
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
    return route?.items || null;
};
export const getRouteParent = (state, routeId = null, level = 1) => {
    const route = getRoute(state, routeId);
    const breadcrumbs = route ? getRouteBreadcrumbs(state, route.id) : [];
    return breadcrumbs.length > level + 1
        ? breadcrumbs[breadcrumbs.length - (level + 1)]
        : null;
};
// TODO levels...
export const getNavItems = (state, routeId/*, level = 1*/) => getRouteChildren(state, routeId);
