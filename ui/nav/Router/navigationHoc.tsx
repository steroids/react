import * as React from 'react';
import _isArray from 'lodash-es/isArray';
import _isObject from 'lodash-es/isObject';
import {getRoute} from '../../../reducers/router';
import {isRouterInitialized} from '../../../reducers/router';
import {initRoutes, initParams} from '../../../actions/router';
import connect, {IConnectHocOutput} from '../../../hoc/connect';

export interface INavigationHocInputProps {
    defaultRoles?: string[];
}

interface INavigationHocPrivateProps extends INavigationHocInputProps, IConnectHocOutput {
    /*
        isInitialized: PropTypes.bool
     */
    isRouterInitialized?: boolean,
    routes?: boolean,
    route?: boolean,
}

const stateMap = state => ({
    isRouterInitialized: isRouterInitialized(state),
    route: getRoute(state)
});
export const walkRoutesRecursive = (item, defaultItem: any = {}, parentItem: any = {}) => {
    const normalizedItem = {
        ...defaultItem,
        ...item,
        id: item.id,
        exact: item.exact,
        path: item.path && (item.path.indexOf('/') !== 0 && parentItem.path ? parentItem.path + '/': '') + item.path,
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
        items = Object.keys(item.items).map(id =>
            walkRoutesRecursive({...item.items[id], id}, defaultItem, normalizedItem)
        );
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
        Object.keys(item.items).map(id => {
            items = items.concat(
                treeToList(
                    {
                        ...item.items[id],
                        id
                    },
                    false
                )
            );
        });
    }

    return items;
};
export default (routes = null): any => WrappedComponent =>
    connect(stateMap)(
        class NavigationHoc extends React.PureComponent<INavigationHocPrivateProps> {
            static WrappedComponent = WrappedComponent;

            UNSAFE_componentWillMount() {
                const routesTree = routes || (!_isArray(this.props.routes) ? this.props.routes : null);
                if (routesTree) {
                    this.props.dispatch(
                        initRoutes(
                            walkRoutesRecursive(
                                {id: 'root', ...routesTree},
                                this.props.defaultRoles ? {roles: this.props.defaultRoles} : undefined
                            )
                        )
                    );
                }
                this._initParams(this.props);
            }

            UNSAFE_componentWillReceiveProps(nextProps) {
                if (!this.props.route && nextProps.route) {
                    this._initParams(nextProps);
                }
            }

            render() {
                if (!_isArray(this.props.routes) && !this.props.isRouterInitialized) {
                    return null;
                }
                return <WrappedComponent {...this.props} />;
            }

            _initParams(props) {
                if (props.route) {
                    this.props.dispatch(initParams(props.route.params));
                }
            }
        }
    )
