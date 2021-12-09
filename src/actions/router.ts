import {push, replace} from 'connected-react-router';

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

export const goToRoute = (routeId, params = null, isReplace = false) => (dispatch, getState, {store}) => {
    if (process.env.PLATFORM === 'mobile') {
        store.navigationNative.navigate(routeId, params);
        return [];
    }

    const getRouteProp = require('../reducers/router').getRouteProp;
    const buildUrl = require('../reducers/router').buildUrl;
    const path = getRouteProp(getState(), routeId, 'path');
    const method = isReplace ? replace : push;
    return dispatch(method(buildUrl(path, params)));
};

export const goToParent = (level = 1) => (dispatch, getState) => {
    const getRouteParent = require('../reducers/router').getRouteParent;
    const getRouteParams = require('../reducers/router').getRouteParams;
    const state = getState();
    const params = getRouteParams(state);
    const parentRoute = getRouteParent(state, level);
    const parentRouteId = parentRoute ? parentRoute.id : null;
    const parentRouteParams = parentRoute ? params : null;
    if (parentRouteId) {
        return dispatch(goToRoute(parentRouteId, parentRouteParams));
    }
    return [];
};
