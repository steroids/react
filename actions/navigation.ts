import _isArray from 'lodash-es/isArray';
import _trim from 'lodash-es/trim';
import { push } from 'connected-react-router';
export const NAVIGATION_INIT_ROUTES = 'NAVIGATION_INIT_ROUTES';
export const NAVIGATION_SET_PARAMS = 'NAVIGATION_SET_PARAMS';
export const NAVIGATION_ADD_CONFIGS = 'NAVIGATION_ADD_CONFIGS';
export const NAVIGATION_REMOVE_CONFIGS = 'NAVIGATION_REMOVE_CONFIGS';
export const NAVIGATION_SET_DATA = 'NAVIGATION_SET_DATA';
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
export const initRoutes = routesTree => ({
  type: NAVIGATION_INIT_ROUTES,
  routesTree
});
export const initParams = params => ({
  type: NAVIGATION_SET_PARAMS,
  params
});
export const goToPage = (pageId, params = {}) => (dispatch, getState) => {
  const getNavUrl = require('../reducers/navigation').getNavUrl;
  return dispatch(push(getNavUrl(getState(), pageId, params)));
};
export const goToParent = (level = 1) => (dispatch, getState) => {
  const getParentRoute = require('../reducers/navigation').getParentRoute;
  const getCurrentRoute = require('../reducers/navigation').getCurrentRoute;
  const state = getState();
  const currentRoute = getCurrentRoute(state);
  const parentRoute = getParentRoute(state, level);
  const parentRouteId = parentRoute ? parentRoute.id : null;
  const parentRouteParams = parentRoute ? currentRoute.params : null;
  if (parentRouteId) {
    return dispatch(goToPage(parentRouteId, parentRouteParams));
  }
};
export const getConfigId = config => config.id || _trim(config.url, '/');
export const navigationAddConfigs = configs => dispatch => {
  configs = normalizeConfigs(configs);
  dispatch({
    type: NAVIGATION_ADD_CONFIGS,
    configs
  });
  configs.forEach(config => {
    const onFetch = config.onFetch || defaultFetchHandler;
    onFetch(config).then(data =>
      dispatch({
        type: NAVIGATION_SET_DATA,
        config,
        data
      })
    );
  });
};
export const navigationRemoveConfigs = configs => {
  configs = normalizeConfigs(configs);
  return {
    type: NAVIGATION_REMOVE_CONFIGS,
    configs
  };
};
