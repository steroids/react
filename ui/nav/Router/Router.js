import React from 'react';
import PropTypes from 'prop-types';
import {Route, Switch, StaticRouter} from 'react-router';
import {HashRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';
import _get from 'lodash-es/get';

import {components} from '../../../hoc';
import navigationHoc, {treeToList} from '../navigationHoc';
import fetchHoc from '../fetchHoc';
import {getCurrentItemParam} from '../../../reducers/navigation';

export default
@navigationHoc()
@connect(
    state => ({
        pathname: _get(state, 'router.location.pathname'),
        pageId: getCurrentItemParam(state, 'id'),
    })
)
@components('store')
class Router extends React.PureComponent {

    static propTypes = {
        wrapperView: PropTypes.elementType,
        wrapperProps: PropTypes.object,
        routes: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.arrayOf(PropTypes.shape({
                path: PropTypes.string,
                component: PropTypes.elementType,
            })),
        ]),
        pathname: PropTypes.string,
        pageId: PropTypes.string,
        autoScrollTop: PropTypes.bool,
    };

    static defaultProps = {
        autoScrollTop: true,
    };

    static contextTypes = {
        history: PropTypes.object,
    };

    constructor() {
        super(...arguments);

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
        if (window.history && nextProps.pathname === '/' && location.pathname.match(/\/$/)) {
            window.history.replaceState({}, '', this.props.store.history.basename);
        }

        if (this.props.autoScrollTop && this.props.pageId && nextProps.pageId && this.props.pageId !== nextProps.pageId) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        // TODO double render!!..

        if (process.env.IS_SSR) {
            return (
                <StaticRouter
                    location={this.context.history.location}
                    context={this.context.staticContext}
                >
                    {this.renderContent()}
                </StaticRouter>
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
        let Component = route.component;

        if (route.fetch) {
            Component = fetchHoc(route.fetch)(Component);
        }

        return (
            <Component
                {...props}
                {...route.componentProps}
            />
        );
    }

}
