import * as React from 'react';
import {connect} from 'react-redux';
import _get from 'lodash-es/get';
import _isFunction from 'lodash-es/isFunction';
import _isObject from 'lodash-es/isObject';
import _upperFirst from 'lodash-es/upperFirst';
import _merge from 'lodash-es/merge';
import _intersection from 'lodash-es/intersection';

import {getRoute, IRoute} from '../reducers/router';
import {getData, getInitializeCounter, getUser, isInitialized} from '../reducers/auth';
import {init, setData, setUser} from '../actions/auth';
import {setMeta} from '../actions/fields';
import {goToRoute} from '../actions/router';
import components, {IComponentsHocOutput} from './components';
import {IConnectHocOutput} from './connect';
import {IRouteItem} from '../ui/nav/Router/Router';

export const STATUS_LOADING = 'loading';
export const STATUS_NOT_FOUND = 'not_found';
export const STATUS_RENDER_ERROR = 'render_error';
export const STATUS_HTTP_ERROR = 'render_error';
export const STATUS_ACCESS_DENIED = 'access_denied';
export const STATUS_OK = 'ok';

/**
 * Layout HOC
 * Используется для макета (layout) приложения, добавляя в него данные авторизации и статуса рендера страницы.
 * Передаваемый первым аргументом `initAction` будет вызываться каждый раз, когда необходимо обновить данные
 * авторизации (первая загрузка страницы, логин/регистация и выход).
 */
export interface ILayoutHocInput {
    route?: IRoute,
    user?: {
        role: string,
    },
    data?: object,
    initializeCounter?: number,
    components: IComponentsHocOutput,
    isInitialized?: boolean,
    redirectPageId?: any,
}

export interface ILayoutHocOutput {
    http?: any,
    status: string,
    renderError: string,
    route: IRouteItem,
    user: any,
    data: any,
    isInitialized: boolean,
}

interface ILayoutHocPrivateProps extends IConnectHocOutput, IComponentsHocOutput {

}

interface ILayoutHocState {
    httpError?: string,
    renderError?: string,
}

const stateMap = state => ({
    route: getRoute(state),
    user: getUser(state),
    data: getData(state),
    isInitialized: isInitialized(state),
    initializeCounter: getInitializeCounter(state),
    redirectPageId: state.auth.redirectPageId
});

export default (initAction): any => WrappedComponent =>
    connect(stateMap)(
        components('http')(
            class LayoutHoc extends React.PureComponent<ILayoutHocInput & ILayoutHocPrivateProps, ILayoutHocState> {
                static WrappedComponent = WrappedComponent;
                /**
                 * Proxy real name, prop types and default props
                 */
                static displayName = WrappedComponent.displayName || WrappedComponent.name;
                static propTypes = {};

                static getDerivedStateFromError(e) {
                    return {
                        renderError: String(e)
                    };
                }

                constructor(props) {
                    super(props);
                    this.state = {
                        renderError: null,
                        httpError: null
                    };
                }

                UNSAFE_componentWillMount() {
                    // Callback for load initial page data (return promise)
                    if (_isFunction(initAction)) {
                        this.props.dispatch(init(true));
                    }
                }

                componentDidUpdate(prevProps) {
                    if (
                        _isFunction(initAction) &&
                        this.props.initializeCounter > prevProps.initializeCounter
                    ) {
                        initAction(this.props, this.props.dispatch)
                            .then(data => {
                                // Configure components
                                if (_isObject(data.config)) {
                                    const components = this.props.components;
                                    Object.keys(data.config).map(name => {
                                        if (components[name]) {
                                            Object.keys(data.config[name]).map(key => {
                                                const value = data.config[name][key];
                                                const setter = 'set' + _upperFirst(key);
                                                if (_isFunction(components[name][setter])) {
                                                    components[name][setter](value);
                                                } else if (
                                                    _isObject(components[name][key]) &&
                                                    _isObject(value)
                                                ) {
                                                    _merge(components[name][key], value);
                                                } else {
                                                    components[name][key] = value;
                                                }
                                            });
                                        }
                                    });
                                }
                                const {user, meta} = data;
                                delete data.user;
                                delete data.meta;
                                this.props.dispatch(
                                    [
                                        // Meta models & enums
                                        Boolean(meta) && setMeta(meta),
                                        // User auth
                                        setData(data),
                                        // User auth
                                        setUser(user),
                                        this.props.redirectPageId && goToRoute(this.props.redirectPageId)
                                    ].filter(Boolean)
                                );
                            })
                            .catch(e => {
                                this.setState({
                                    httpError: e
                                });
                                throw e;
                            });
                    }
                }

                render() {
                    let status = STATUS_OK;
                    if (!this.props.isInitialized) {
                        status = STATUS_LOADING;
                    } else if (this.state.renderError) {
                        status = STATUS_RENDER_ERROR;
                    } else if (this.state.httpError) {
                        status = STATUS_HTTP_ERROR;
                    } else if (!this.props.route) {
                        status = STATUS_NOT_FOUND;
                    } else {
                        const pageRoles = _get(this.props, 'route.roles') || [];
                        const userRoles = []
                            .concat(_get(this.props, 'user.role') || [])
                            .concat(_get(this.props, 'user.roles') || []);
                        if (userRoles.length === 0) {
                            userRoles.push(null); // Guest
                        }
                        if (_intersection(pageRoles, userRoles).length === 0) {
                            status = STATUS_ACCESS_DENIED;
                            if (process.env.NODE_ENV !== 'production') {
                                console.log(
                                    'Access denied. Page roles: ',
                                    pageRoles,
                                    'User roles:',
                                    userRoles.join(),
                                    'Route:',
                                    this.props.route
                                ); // eslint-disable-line no-console
                            }
                        }
                    }

                    const outputProps = {
                        status,
                        renderError: this.state.renderError,
                        ...this.props.data,
                    } as ILayoutHocOutput;

                    return (
                        <WrappedComponent
                            {...this.props}
                            {...outputProps}
                        />
                    );
                }
            }
        )
    )
