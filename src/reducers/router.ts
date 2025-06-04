import {parse, compile} from 'path-to-regexp';
import {matchPath} from 'react-router';
import * as queryString from 'qs';
import _get from 'lodash-es/get';
import _isEmpty from 'lodash-es/isEmpty';
import _isEqual from 'lodash-es/isEqual';
import _pick from 'lodash-es/pick';
import _isObject from 'lodash-es/isObject';
import _isFunction from 'lodash-es/isFunction';
import {IRouteItem} from '../ui/nav/Router/Router';
import {
    ROUTER_INIT_ROUTES,
    ROUTER_SET_PARAMS,
} from '../actions/router';

type TRouteIdArg = string | null;

export interface IRouterInitialState {
    location: {
        pathname: string,
        search: string,
        hash: string,
        query: Record<string, unknown> | null,
    } | null,
    routesTree: IRouteItem | null,
    routesMap: {[key: string]: IRouteItem, } | null,
    activeIds: string[] | null,
    match: {
        path: string,
        url: string,
        isExact: string,
        params: Record<string, unknown> | null,
    } | null,

    params: Record<string, unknown>,
    configs: any,
    data: Record<string, unknown>,
    counters: Record<string, unknown>,
}

const initialState: IRouterInitialState = {
    location: null,
    routesTree: null,
    routesMap: null,
    activeIds: null,
    match: null,

    params: {},
    configs: [],
    data: {},
    counters: {},
};

type TUrlParams = {[key: string]: unknown, } | null;

/**
 * Generate url for route by path and params
 * @param path
 * @param params
 */
export const buildUrl = (path, params: TUrlParams = null) => {
    // Get url
    let url = path;
    let pathKeys = [];
    try {
        pathKeys = (parse(path) as unknown as any[])
            .map((p: any) => p.name)
            .filter(Boolean);
        url = compile(path)({
            ...(params as {}),
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
export const checkIsActive = (state, item) => {
    // Check is active
    const pathname = !process.env.IS_SSR && window.location.protocol === 'file:'
        ? window.location.hash
            .replace(/^#/, '')
            .replace(/\?.*$/, '')
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
export const normalizeRoutes = (state, item: IRouteItem, activeIds: string[], routesMap: Record<string, unknown>) => {
    let items = null;
    if (Array.isArray(item.items)) {
        items = item.items.map(subItem => normalizeRoutes(state, subItem, activeIds, routesMap));
    } else if (_isObject(item.items)) {
        items = Object.keys(item.items)
            .map(id => normalizeRoutes(state, {
                ...item.items[id],
                id,
            }, activeIds, routesMap));
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
export const findRecursive = (
    item: IRouteItem,
    predicate: string | any,
    pathItems: IRouteItem[] | null = null,
): IRouteItem | null => {
    if ((_isFunction(predicate) && predicate(item)) || predicate === item?.id) {
        if (pathItems) {
            pathItems.push(item);
        }
        return item;
    }

    if (Array.isArray((item?.items))) {
        const foundedItem = item.items.find(subItem => findRecursive(subItem, predicate, pathItems)) || null;
        if (foundedItem && pathItems) {
            pathItems.push(item);
        }
        return foundedItem;
    }
    return null;
};

export const getMatch = (currentRoute, state) => {
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
        const newActiveIds = Object.keys(state.routesMap).filter(id => checkIsActive(state, state.routesMap[id]));
        const currentRoute = newActiveIds.length > 0 ? state.routesMap[newActiveIds[0]] : null;
        if (!_isEqual(newActiveIds, state.activeIds)) {
            state.activeIds = newActiveIds;
        }

        return {
            ...state,
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
};
export default (state = initialState, action) => reducerMap[action.type]
    ? reducerMap[action.type](state, action)
    : state;

export const isRouterInitialized = state => !!state.router.routesTree;
export const getRouterParams = state => _get(state.router, 'params');
export const getActiveRouteIds = state => _get(state.router, 'activeIds') || null;
export const getRoutesMap = state => _get(state.router, 'routesMap') || null;
export const getRouteId = state => _get(state.router, 'activeIds.0') || null;
export const getRoute = (state, routeId: TRouteIdArg = null): IRouteItem => _get(
    state.router, ['routesMap', routeId || getRouteId(state)],
) || null;
export const getRouteProp = (state, routeId: TRouteIdArg = null, propName) => _get(
    getRoute(state, routeId), propName,
) || null;
export const getRouteParams = state => _get(state.router, 'match.params') || null;
export const getRouteParam = (state, paramName) => _get(getRouteParams(state), paramName) || null;
export const getRouteBreadcrumbs = (state, routeId: TRouteIdArg = null): IRouteItem[] => {
    const items = [];
    routeId = routeId || getRouteId(state);
    findRecursive(state.router.routesTree, routeId, items);
    return items.reverse().filter(item => item.isVisible !== false && item.isNavVisible !== false);
};
export const getRouteChildren = (state, routeId: TRouteIdArg = null) => {
    const route = getRoute(state, routeId);
    return route?.items || null;
};
export const getRouteParent = (state, routeId: TRouteIdArg = null, level = 1) => {
    const route = getRoute(state, routeId);
    const breadcrumbs = route ? getRouteBreadcrumbs(state, route.id) : [];
    return breadcrumbs.length > level
        ? breadcrumbs[breadcrumbs.length - (level + 1)]
        : null;
};
// TODO levels...
export const getNavItems = (state, routeId/*, level = 1*/) => getRouteChildren(state, routeId);
