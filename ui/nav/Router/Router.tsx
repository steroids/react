import * as React from 'react';
import {Route, Switch, Redirect, StaticRouter} from 'react-router';
import {HashRouter} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router';
import _get from 'lodash-es/get';
import _isEqual from 'lodash-es/isEqual';
import _isArray from 'lodash-es/isArray';
import _isObject from 'lodash-es/isObject';
import {useComponents, useSelector} from '@steroidsjs/core/hooks';
import {useEffect, useState} from 'react';
import {useEffectOnce, usePrevious, useUpdateEffect} from 'react-use';
import {fetch} from '@steroidsjs/core/hoc';
import {initParams, initRoutes} from '@steroidsjs/core/actions/router';
import useDispatch from '@steroidsjs/core/hooks/useDispatch';
import {getActiveRouteIds, getRoute, isRouterInitialized} from '../../../reducers/router';
import {SsrProviderContext} from './SsrProvider';
import {IFetchHocConfigFunc} from '../../../hoc/fetch';

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
    fetch?: IFetchHocConfigFunc,
    items?: IRouteItem[] | {[key: string]: IRouteItem};
    [key: string]: any,
}

export interface IRouterProps {
    wrapperView?: any;
    wrapperProps?: any;
    routes?: IRouteItem[] | {[key: string]: IRouteItem};
    pathname?: string;
    routeId?: string;
    activeRouteIds?: string[];
    defaultRoles?: string[];
    autoScrollTop?: boolean;
    history?: any;
    store?: any;
    basename?: any;
    activePath?: string;
    children?: React.ReactNode,
}

const findRedirectPathRecursive = (route: IRouteItem) => {
    if (!route) {
        return null;
    }

    if (typeof route.redirectTo === 'boolean') {
        const key = _isObject(route.items) && !_isArray(route.items) ? Object.keys(route.items)[0] : '0';
        return findRedirectPathRecursive(_get(route, ['items', key]));
    } if (typeof route.redirectTo === 'string') {
        return route.redirectTo;
    }

    return route.path || route.path === ''
        ? route.path
        : null;
};

export const walkRoutesRecursive = (item, defaultItem: any = {}, parentItem: any = {}) => {
    const normalizedItem = {
        ...defaultItem,
        ...item,
        id: item.id,
        exact: item.exact,
        path: item.path && (item.path.indexOf('/') !== 0 && parentItem.path ? parentItem.path + '/' : '') + item.path,
        label: item.label,
        title: item.title,
        isVisible: typeof item.isVisible !== 'undefined'
            ? item.isVisible
            : (typeof parentItem.isVisible !== 'undefined'
                ? parentItem.isVisible
                : defaultItem.isVisible
            ),
        isNavVisible: typeof item.isNavVisible !== 'undefined'
            ? item.isNavVisible
            : (typeof parentItem.isNavVisible !== 'undefined'
                ? parentItem.isNavVisible
                : defaultItem.isNavVisible
            ),
        layout: item.layout || parentItem.layout || defaultItem.layout || null,
        roles: item.roles || parentItem.roles || defaultItem.roles || null,
        component: null,
        componentProps: null,
    };

    let items = null;
    if (_isArray(item.items)) {
        items = item.items.map(i => walkRoutesRecursive(i, defaultItem, normalizedItem));
    } else if (_isObject(item.items)) {
        items = Object.keys(item.items)
            .map(id => walkRoutesRecursive({...item.items[id], id}, defaultItem, normalizedItem));
    }
    return {
        ...normalizedItem,
        items,
    };
};

export const treeToList = (item, isRoot = true) => {
    if (_isArray(item)) {
        return item;
    }
    if (isRoot && !item.id) {
        item.id = 'root';
    }
    let items = item.path ? [item] : [];
    if (_isArray(item.items)) {
        item.items.forEach(sub => {
            items = items.concat(treeToList(sub, false));
        });
    } else if (_isObject(item.items)) {
        Object.keys(item.items).forEach(id => {
            items = items.concat(treeToList({...item.items[id], id}, false));
        });
    }

    return items;
};

const renderComponent = (route: IRouteItem, activePath, routeProps) => {
    if (route.redirectTo && route.path === activePath) {
        const to = findRedirectPathRecursive(route);
        if (to === null) {
            // eslint-disable-next-line no-console
            console.error('Not found path for redirect in route:', route);
            return null;
        }

        // Check already redirected
        if (activePath !== to) {
            return (
                <Redirect
                    {...routeProps}
                    to={to}
                    {...route.componentProps}
                />
            );
        }
    }

    if (!route.component) {
        return null;
    }

    let Component = route.component;
    if (route.fetch) {
        Component = fetch(route.fetch)(Component);
    }
    return (
        <Component
            {...routeProps}
            {...route.componentProps}
        />
    );
};

// TODO @navigationHoc()
function Router(props: IRouterProps) {
    const components = useComponents();

    const {isInitialized, pathname, route, routeParams, activePath, activeRouteIds} = useSelector(state => ({
        isRouterInitialized: isRouterInitialized(state),
        pathname: _get(state, 'router.location.pathname'),
        route: getRoute(state),
        routeParams: state.router.params,
        activePath: state.router?.location?.pathname,
        activeRouteIds: getActiveRouteIds(state),
    }));
    const routeId = route?.id || null;

    // Init routes in redux
    const dispatch = useDispatch();
    useEffectOnce(() => {
        if (props.routes) {
            dispatch(
                initRoutes(
                    walkRoutesRecursive(
                        {id: 'root', ...props.routes},
                        props.defaultRoles ? {roles: props.defaultRoles} : undefined,
                    ),
                ),
            );
        }
    });

    // Sync route params with redux
    const prevRouteParams = usePrevious(routeParams);
    useEffect(() => {
        if (!_isEqual(prevRouteParams, routeParams)) {
            dispatch(initParams(routeParams));
        }
    }, [dispatch, prevRouteParams, routeParams]);

    // Routes state
    const [routes, setRoutes] = useState(treeToList(props.routes));
    useUpdateEffect(() => {
        setRoutes(props.routes);
    }, [props.routes]);

    // Fix end slash on switch to base route
    useUpdateEffect(() => {
        if (window.history && pathname === '/' && window.location.pathname.match(/\/$/)) {
            window.history.replaceState({}, '', components.store.history.basename);
        }
    }, [components.store.history.basename, pathname]);

    // Auto scroll to top
    useUpdateEffect(() => {
        if (props.autoScrollTop && routeId) {
            window.scrollTo(0, 0);
        }
    }, [props.autoScrollTop, routeId]);

    const renderItem = (routeItem: IRouteItem, routeProps) => {
        let children = null;
        activeRouteIds.find(activeRouteId => {
            if (activeRouteId === routeItem.id) {
                // Stop
                return true;
            }

            const activeRoute = routes.find(r => r.id === activeRouteId);
            children = renderComponent(activeRoute, activePath, {...routeProps, children}) || children;
            return false;
        });

        const result = renderComponent(routeItem, activePath, {...routeProps, children});
        if (!result) {
            // eslint-disable-next-line no-console
            console.error('Not found component for route:', routeItem);
        }
        return result;
    };

    const renderContent = () => {
        const WrapperComponent = props.wrapperView;
        const routeNodes = (
            <Switch>
                {routes.map((routeItem, index) => (
                    <Route
                        key={index}
                        render={routeProps => renderItem(routeItem, routeProps)}
                        {...routeItem}
                        component={null}
                    />
                ))}
                {props.children}
            </Switch>
        );
        if (WrapperComponent) {
            return (
                <WrapperComponent {...props.wrapperProps}>
                    {routeNodes}
                </WrapperComponent>
            );
        }
        return routeNodes;
    };

    if (!isInitialized) {
        return null;
    }

    // TODO double render!!..
    if (process.env.IS_SSR) {
        return (
            <SsrProviderContext.Consumer>
                {context => (
                    <StaticRouter
                        location={components.store.history.location}
                        context={context.staticContext}
                    >
                        {renderContent()}
                    </StaticRouter>
                )}
            </SsrProviderContext.Consumer>
        );
    } if (window.location.protocol === 'file:') {
        return (
            <HashRouter>
                {renderContent()}
            </HashRouter>
        );
    }
    return (
        <ConnectedRouter history={components.store.history}>
            {renderContent()}
        </ConnectedRouter>
    );
}

Router.defaultProps = {
    autoScrollTop: true,
};

export default Router;
