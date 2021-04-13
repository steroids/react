import {useState} from 'react';
import _isFunction from 'lodash-es/isFunction';
import _isObject from 'lodash-es/isObject';
import _upperFirst from 'lodash-es/upperFirst';
import _merge from 'lodash-es/merge';
import _intersection from 'lodash-es/intersection';
import {useMount, usePrevious, useUpdateEffect} from 'react-use';
import useComponents from './useComponents';
import {getRoute} from '../reducers/router';
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

export default function useLayout(initAction: any = null): ILayout {
    const {route, user, data, isInitialized, initializeCounter, redirectPageId} = useSelector(state => ({
        route: getRoute(state),
        user: getUser(state),
        data: getData(state),
        isInitialized: getIsInitialized(state),
        initializeCounter: getInitializeCounter(state),
        redirectPageId: state.auth.redirectPageId,
    }));

    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const components = useComponents();
    useMount(() => {
        // Callback for load initial page data (return promise)
        if (_isFunction(initAction)) {
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

        initAction(null, dispatch)
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
                dispatch(
                    [
                        // Meta models & enums
                        Boolean(resultMeta) && setMeta(resultMeta),
                        // User auth
                        setData(result),
                        // User auth
                        setUser(resultUser),
                        redirectPageId && goToRoute(redirectPageId),
                    ].filter(Boolean),
                );
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

    return {
        status,
        error,
        data,
    };
}
