import * as React from 'react';
import {Route, Switch, Redirect, StaticRouter} from 'react-router';
import {HashRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';
import _get from 'lodash-es/get';
import _isBoolean from 'lodash-es/isBoolean';
import _isArray from 'lodash-es/isArray';
import _isObject from 'lodash-es/isObject';
import {components, fetch} from '../../../hoc';
import navigationHoc, {INavigationHocInputProps, treeToList} from './navigationHoc';
import {getRouteId} from '../../../reducers/router';
import {SsrProviderContext} from './SsrProvider';
import {IConnectHocOutput} from '../../../hoc/connect';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IFetchHocConfig} from '../../../hoc/fetch';

export interface IRouteItem {
    id?: string,
    label?: string,
    title?: string,
    path?: string,
    exact?: boolean,
    redirectTo?: boolean | string,
    component?: any,
    componentProps?: any,
    layout?: string,
    isVisible?: boolean,
    isNavVisible?: boolean,
    models?: string | string[],
    enums?: string | string[],
    roles?: string[],
    fetch?: IFetchHocConfig,
    items?: IRouteItem[] | {[key: string]: IRouteItem};
}

export interface IRouterProps extends INavigationHocInputProps {
    wrapperView?: any;
    wrapperProps?: any;
    routes?: IRouteItem[] | {[key: string]: IRouteItem};
    pathname?: string;
    routeId?: string;
    autoScrollTop?: boolean;
    history?: any;
    store?: any;
    basename?: any;
}

interface IRouterPrivateProps extends IConnectHocOutput, IComponentsHocOutput {

}

type RouterState = {
    routes?: any,
    map?: any
};
@navigationHoc()
@connect(state => ({
    pathname: _get(state, 'router.location.pathname'),
    routeId: getRouteId(state)
}))
@components('store')
export default class Router extends React.Component<IRouterProps & IRouterPrivateProps, RouterState> {
    static defaultProps = {
        autoScrollTop: true
    };

    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this.state = {
            routes: treeToList(this.props.routes),
        };
    }

    shouldComponentUpdate(nextProps) {
        // Do not re-render component, routes tree is static
        return false;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.routes !== nextProps.routes) {
            this.setState({routes: nextProps.routes});
        }
        // Fix end slash on switch to base route
        if (
            window.history &&
            nextProps.pathname === '/' &&
            location.pathname.match(/\/$/)
        ) {
            window.history.replaceState({}, '', this.props.store.history.basename);
        }
        if (
            this.props.autoScrollTop &&
            this.props.routeId &&
            nextProps.routeId &&
            this.props.routeId !== nextProps.routeId
        ) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        // TODO double render!!..
        if (process.env.IS_SSR) {
            return (
                <SsrProviderContext.Consumer>
                  {context => (
                      <StaticRouter
                          location={this.props.store.history.location}
                          context={context.staticContext}
                      >
                        {this.renderContent()}
                      </StaticRouter>
                  )}
                </SsrProviderContext.Consumer>
            );
        } else if (location.protocol === 'file:') {
            return (
                <HashRouter>
                    {this.renderContent()}
                </HashRouter>
            );
        } else {
            return (
                <ConnectedRouter history={this.props.store.history}>
                    {this.renderContent()}
                </ConnectedRouter>
            );
        }
    }

    renderContent() {
        const WrapperComponent = this.props.wrapperView;
        const routes = (
            <Switch>
                {this.state.routes.map((route, index) => (
                    <Route
                        key={index}
                        render={props => this._renderItem(route, props)}
                        {...route}
                        component={null}
                    />
                ))}
                {this.props.children}
            </Switch>
        );
        if (WrapperComponent) {
            return (
                <WrapperComponent {...this.props.wrapperProps}>
                    {routes}
                </WrapperComponent>
            );
        }
        return routes;
    }

    _renderItem(route: IRouteItem, props) {
        if (route.redirectTo) {
            const to = this._findRedirectPathRecursive(route);
            if (to === null) {
                console.error('Not found path for redirect in route:', route)
                return null;
            }
            return (
                <Redirect
                    {...props}
                    to={to}
                    {...route.componentProps}
                />
            );
        }

        if (!route.component) {
            console.error('Not found component for route:', route)
            return null;
        }

        let Component = route.component;
        if (route.fetch) {
            Component = fetch(route.fetch)(Component);
        }
        return (
            <Component
                {...props}
                {...route.componentProps}
            />
        );
    }

    _findRedirectPathRecursive(route: IRouteItem) {
        if (!route) {
            return null;
        }

        if (typeof route.redirectTo === 'boolean') {
            const key = _isObject(route.items) && !_isArray(route.items) ? Object.keys(route.items)[0] : '0';
            return this._findRedirectPathRecursive(_get(route, ['items', key]));
        } else if (typeof route.redirectTo === 'string') {
            return route.redirectTo;
        }

        return route.path || route.path === '' ? route.path : null;
    }
}
