import {goToRoute} from './router';

export const AUTH_INIT = 'AUTH_INIT';
export const AUTH_INIT_USER = 'AUTH_INIT_USER';
export const AUTH_SET_DATA = 'AUTH_SET_DATA';
export const AUTH_ADD_SOCIAL = 'AUTH_ADD_SOCIAL';

export const init = (skipInitialized = false) => (dispatch, getState) => {
    if (skipInitialized) {
        const state = getState();
        if (state.auth && state.auth.isInitialized) {
            return [];
        }
    }
    return dispatch({
        type: AUTH_INIT,
    });
};

export const reInit = () => init();

export const login = (token, redirectPageId: string | boolean = 'root', params?: any) => (
    dispatch,
    getState,
    {http},
) => {
    http.onLogin({
        accessToken: token,
        ...params,
    });
    return dispatch({
        type: AUTH_INIT,
        redirectPageId: redirectPageId || null,
    });
};

export const addSocial = social => ({
    type: AUTH_ADD_SOCIAL,
    social,
});

export const setUser = user => ({
    type: AUTH_INIT_USER,
    user: user || null,
});

export const setData = data => ({
    type: AUTH_SET_DATA,
    data,
});

export const logout = (routeId: string | boolean = 'root', routeParams: any = null) => (dispatch, getState, {http}) => {
    http.onLogout();
    return dispatch([
        setUser(null),
        routeId && goToRoute(routeId, routeParams),
    ].filter(Boolean));
};
