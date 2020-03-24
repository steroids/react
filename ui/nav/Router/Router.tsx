import * as React from 'react';
import {Route, Switch, Redirect, StaticRouter} from 'react-router';
import {HashRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';
import _get from 'lodash-es/get';
import {components} from '../../../hoc';
import navigationHoc, {treeToList} from './navigationHoc';
import {getRouteId} from '../../../reducers/router';
import {SsrProviderContext} from './SsrProvider';
import {IConnectHocOutput} from '../../../hoc/connect';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IRouteItem {
    id?: string,
    path?: string,
    exact?: boolean,
    component?: any,
    roles?: string[],
    items?: IRouteItem[] | {[key: string]: IRouteItem};
}

export interface IRouterProps {
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
export default class Router extends React.PureComponent<IRouterProps & IRouterPrivateProps, RouterState> {
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

    _renderItem(route, props) {
        if (route.redirectTo) {
            return (
                <Redirect
                    {...props}
                    to={route.redirectTo}
                    {...route.componentProps}
                />
            );
        }

        const Component = route.component;
        return (
            <Component
                {...props}
                {...route.componentProps}
            />
        );
    }
}
