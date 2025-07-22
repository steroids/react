import {push, replace} from 'connected-react-router';
import {parse} from 'path-to-regexp';

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

// Include in the result only those parameters that are present as route parameters in the path
// For example, given the path '/users/:id' and the parameters { id: 1, page: 3, totalPages: 10 }, the function will return { id: 1 }.
export const filterParamsForPath = (path: string, params: Record<string, string | number>) => {
    const parsedPath = parse(path);

    return parsedPath.reduce((filteredParams, param) => {
        if (typeof param === 'object' && params[param.name]) {
            filteredParams[param.name] = params[param.name];
        }
        return filteredParams;
    }, {});
};

// showQueryParams используется для передачи query параметров в URL
export const goToRoute = (routeId, params: RouteParams = null, isReplace = false, showQueryParams = false) => (dispatch, getState, {store}) => {
    if (process.env.PLATFORM === 'mobile') {
        store.navigationNative.navigate(routeId, params);
        return [];
    }

    const getRouteProp = require('../reducers/router').getRouteProp;
    const buildUrl = require('../reducers/router').buildUrl;
    const path = getRouteProp(getState(), routeId, 'path');
    const filteredParams = filterParamsForPath(path, params);
    const currentParams = showQueryParams ? params : filteredParams;
    const routeUrl = buildUrl(path, currentParams);
    const reduxAction = isReplace ? replace(routeUrl) : push(routeUrl);
    return dispatch(reduxAction);
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
