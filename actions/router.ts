import _isArray from 'lodash-es/isArray';
import _trim from 'lodash-es/trim';
import { push } from 'connected-react-router';
export const ROUTER_INIT_ROUTES = 'ROUTER_INIT_ROUTES';
export const ROUTER_SET_PARAMS = 'ROUTER_SET_PARAMS';
export const ROUTER_ADD_CONFIGS = 'ROUTER_ADD_CONFIGS';
export const ROUTER_REMOVE_CONFIGS = 'ROUTER_REMOVE_CONFIGS';
export const ROUTER_SET_DATA = 'ROUTER_SET_DATA';
const normalizeConfigs = configs => {
  if (!configs) {
    configs = [];
  }
  if (!_isArray(configs)) {
    configs = [configs];
  }
  configs.forEach((config, index) => {
    if (!config.url && !config.id) {
      throw new Error('id or url is required');
    }
    configs[index] = {
      method: 'get',
      params: {},
      ...config
    };
  });
  return configs;
};
const defaultFetchHandler = config => (dispatch, getState, { http }) => {
  return dispatch(
    http
      .send(config.method, config.url, config.params)
      .then(result => result.data)
  );
};
export const initRoutes = routes => ({
  type: ROUTER_INIT_ROUTES,
  routes,
});
export const initParams = params => ({
  type: ROUTER_SET_PARAMS,
  params
});
export const goToRoute = (routeId, params = null) => (dispatch, getState) => {
  const getRouteProp = require('../reducers/router').getRouteProp;
  const buildUrl = require('../reducers/router').buildUrl;
  const path = getRouteProp(getState(), routeId, 'path');
  return dispatch(push(buildUrl(path, params)));
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
};
export const getConfigId = config => config.id || _trim(config.url, '/');
export const navigationAddConfigs = configs => dispatch => {
  configs = normalizeConfigs(configs);
  dispatch({
    type: ROUTER_ADD_CONFIGS,
    configs
  });
  configs.forEach(config => {
    const onFetch = config.onFetch || defaultFetchHandler;
    onFetch(config).then(data =>
      dispatch({
        type: ROUTER_SET_DATA,
        config,
        data
      })
    );
  });
};
export const navigationRemoveConfigs = configs => {
  configs = normalizeConfigs(configs);
  return {
    type: ROUTER_REMOVE_CONFIGS,
    configs
  };
};
