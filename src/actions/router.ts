import {push, replace} from 'connected-react-router';
import {parse} from 'path-to-regexp';

type TParams = Record<string, any> | null;

export const ROUTER_INIT_ROUTES = 'ROUTER_INIT_ROUTES';
export const ROUTER_SET_PARAMS = 'ROUTER_SET_PARAMS';
export const ROUTER_SET_DATA = 'ROUTER_SET_DATA';

export const initRoutes = routes => ({
    type: ROUTER_INIT_ROUTES,
    routes,
});

export const initParams = params => ({
    type: ROUTER_SET_PARAMS,
    params,
});

const filterParamsForPath = (path: string, params: Record<string, string | number>) => {
    if (!path) {
        return params;
    }

    const parsedPath = parse(path);

    return parsedPath.reduce((filteredParams, param) => {
        if (typeof param === 'object' && params[param.name]) {
            filteredParams[param.name] = params[param.name];
        }
        return filteredParams;
    }, {});
};

export const goToRoute = (routeId, params: TParams = null, isReplace = false) => (dispatch, getState, {store}) => {
    if (process.env.PLATFORM === 'mobile') {
        store.navigationNative.navigate(routeId, params);
        return [];
    }

    const getRouteProp = require('../reducers/router').getRouteProp;
    const buildUrl = require('../reducers/router').buildUrl;
    const path = getRouteProp(getState(), routeId, 'path');
    const filteredParams = filterParamsForPath(path, params);
    const method = isReplace ? replace : push;
    return dispatch(method(buildUrl(path, filteredParams)));
};

export const goToParent = (level = 1) => (dispatch, getState) => {
    const getRouteParent = require('../reducers/router').getRouteParent;
    const getRouteParams = require('../reducers/router').getRouteParams;
    const state = getState();
    const params = getRouteParams(state);
    const parentRoute = getRouteParent(state, null, level);
    const parentRouteId = parentRoute ? parentRoute.id : null;
    const parentRouteParams = parentRoute ? params : null;
    if (parentRouteId) {
        return dispatch(goToRoute(parentRouteId, parentRouteParams));
    }
    return [];
};
