import {Dispatch} from 'redux';
import {useState} from 'react';
import _isFunction from 'lodash-es/isFunction';
import _isObject from 'lodash-es/isObject';
import _upperFirst from 'lodash-es/upperFirst';
import _merge from 'lodash-es/merge';
import _intersection from 'lodash-es/intersection';
import {useMount, usePrevious, useUpdateEffect} from 'react-use';
import {ROUTER_ROLE_LOGIN} from '../ui/nav/Router/Router';
import useSsr from './useSsr';
import {IComponents} from '../providers/ComponentsProvider';
import useComponents from './useComponents';
import {getRoute, getRoutesMap} from '../reducers/router';
import {getData, getInitializeCounter, getUser, isInitialized as getIsInitialized} from '../reducers/auth';
import useSelector from './useSelector';
import {init, setData, setUser} from '../actions/auth';
import useDispatch from './useDispatch';
import {setMeta} from '../actions/fields';
import {goToRoute} from '../actions/router';

export interface ILayout {
    status?: string,
    error?: any,
    data?: any,
}

export const STATUS_LOADING = 'loading';
export const STATUS_NOT_FOUND = 'not_found';
export const STATUS_RENDER_ERROR = 'render_error';
export const STATUS_HTTP_ERROR = 'render_error';
export const STATUS_ACCESS_DENIED = 'access_denied';
export const STATUS_OK = 'ok';

export const HTTP_STATUS_CODES = {
    [STATUS_NOT_FOUND]: 404,
    [STATUS_ACCESS_DENIED]: 403,
    [STATUS_OK]: 200,
    [STATUS_RENDER_ERROR]: 500,
    [STATUS_HTTP_ERROR]: 500,
};

export const runInitAction = (
    initAction: (...args: any[]) => Promise<any>,
    components: IComponents,
    dispatch: Dispatch<any>,
) => (
    initAction(null, dispatch, components)
        .then(result => {
            // Configure components
            if (_isObject(result.config)) {
                Object.keys(result.config).forEach(name => {
                    if (!components[name]) {
                        return;
                    }

                    Object.keys(result.config[name]).forEach(key => {
                        const value = result.config[name][key];
                        const setter = 'set' + _upperFirst(key);
                        if (_isFunction(components[name][setter])) {
                            components[name][setter](value);
                        } else if (
                            _isObject(components[name][key])
                        && _isObject(value)
                        ) {
                            _merge(components[name][key], value);
                        } else {
                            components[name][key] = value;
                        }
                    });
                });
            }

            const resultMeta = result.meta;
            const resultUser = result.user;
            delete result.user;
            delete result.meta;

            if (resultMeta) {
                Object.keys(resultMeta).forEach(modelName => {
                    if (resultMeta[modelName].attributes) {
                        components.meta.setModel(modelName, resultMeta[modelName]);
                    }
                });
            }

            dispatch(
                [
                    // Meta models & enums
                    Boolean(resultMeta) && setMeta(resultMeta), // TODO skip models
                    // User auth
                    setData(result),
                    // User auth
                    setUser(resultUser),
                ].filter(Boolean),
            );
        })
);

export default function useLayout(initAction: any = null): ILayout {
    const {
        route,
        user,
        data,
        isInitialized,
        initializeCounter,
        redirectPageId,
        loginRouteId,
    } = useSelector(state => {
        const routesMap = getRoutesMap(state);
        return {
            route: getRoute(state),
            user: getUser(state),
            data: getData(state),
            isInitialized: getIsInitialized(state),
            initializeCounter: getInitializeCounter(state),
            redirectPageId: state.auth.redirectPageId,
            loginRouteId: routesMap && Object.keys(routesMap).find(name => routesMap[name].role === ROUTER_ROLE_LOGIN),
        };
    });

    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const components = useComponents();
    useMount(() => {
        // Callback for load initial page data (return promise)
        if (_isFunction(initAction)) {
            //TODO Remove @ts-ignore
            //@ts-ignore
            dispatch(init(true));
        } else {
            dispatch(setUser(null));
        }
    });

    const initializeCounterPrev = usePrevious(initializeCounter);

    useUpdateEffect(() => {
        if (!_isFunction(initAction) || initializeCounter <= initializeCounterPrev) {
            return;
        }

        runInitAction(initAction, components, dispatch)
            .then(() => {
                if (redirectPageId) {
                    //TODO Remove @ts-ignore
                    //@ts-ignore
                    dispatch(goToRoute(redirectPageId));
                }
            })
            .catch(e => {
                setError(e);
                throw e;
            });
    });

    let status = STATUS_OK;
    if (!isInitialized) {
        status = STATUS_LOADING;
    } else if (error) {
        status = STATUS_HTTP_ERROR;
    } else if (!route) {
        status = STATUS_NOT_FOUND;
    } else {
        const pageRoles = route?.roles || [];
        const userRoles = [].concat(user?.role || []).concat(user?.roles || []);
        if (userRoles.length === 0) {
            userRoles.push(null); // Guest
        }
        if (_intersection(pageRoles, userRoles).length === 0) {
            if (loginRouteId && route.id !== loginRouteId) {
                //TODO Remove @ts-ignore
                //@ts-ignore
                dispatch(goToRoute(loginRouteId));
            } else {
                status = STATUS_ACCESS_DENIED;
                if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                    console.log(
                        'Access denied. Page roles: ',
                        pageRoles,
                        'User roles:',
                        userRoles.join(),
                        'Route:',
                        route,
                    );
                }
            }
        }
    }

    //save status code for ssr
    const ssrContextValue = useSsr();
    if (process.env.IS_SSR) {
        ssrContextValue.staticContext.statusCode = HTTP_STATUS_CODES[status];
    }

    return {
        status,
        error,
        data,
    };
}
