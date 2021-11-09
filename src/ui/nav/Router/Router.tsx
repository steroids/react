import * as React from 'react';
import {Route, Switch, Redirect, StaticRouter} from 'react-router';
import {HashRouter} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router';
import _get from 'lodash-es/get';
import _isEqual from 'lodash-es/isEqual';
import _isArray from 'lodash-es/isArray';
import _isObject from 'lodash-es/isObject';
import {useEffect, useState} from 'react';
import {useEffectOnce, usePrevious, useUpdateEffect} from 'react-use';
import {IFetchConfig} from '../../../hooks/useFetch';
import {IListProps} from '../../list/List/List';
import {useComponents, useSelector} from '../../../hooks';
import {fetch} from '../../../hoc';
import {initParams, initRoutes} from '../../../actions/router';
import useDispatch from '../../../hooks/useDispatch';
import {getActiveRouteIds, getRoute, isRouterInitialized} from '../../../reducers/router';
import {SsrProviderContext} from '../../../providers/SsrProvider';
import {IFetchHocConfigFunc} from '../../../hoc/fetch';

/**
 * Router
 * Маршрутизатор.
 * Компонент получает общий для приложения шаблон и дерево роутов. Из дерева роутов посредством React Router
 * образуется switch-конструкция, которая в зависимости от текущего пути рендерит соответствующий компонент страницы.
 * Или осуществляет редирект на другую страницу. Все страницы оборачиваются в переданный шаблон.
 */
export interface IRouteItem {
    /**
     * Идентификатор роута
     * @example 'catalog'
     */
    id?: string,

    /**
     * Текст, который отобразится на кнопке навигации для данного роута
     * @example 'Каталог'
     */
    label?: string,

    /**
     * Заголовок страницы
     * @example 'Каталог'
     */
    title?: string,

    /**
     * Путь до роута
     * @example '/catalog'
     */
    path?: string,

    /**
     * Если true, то путь должен точно соответствовать location.pathname
     * @example '/catalog'
     */
    exact?: boolean,

    /**
     * В свойстве можно передать как путь, на который осуществится редирект, так и булево значение.
     * Если свойство равно true - то редирект произойдет на первый из вложенных роутов.
     * @example true
     */
    redirectTo?: boolean | string,

    /**
     * Компонент страницы, который отобразится, если путь будет соответствовать location.pathname
     * @example CatalogPage
     */
    component?: any,

    /**
     * Свойства для компонента страницы
     */
    componentProps?: any,

    /**
     * Тип шаблона для данного роута
     * @example 'dark'
     */
    layout?: string,

    /**
     * Отображать или показывать роут
     * @example true
     */
    isVisible?: boolean,

    /**
     * Отображать ссылку или кнопку в навигации для перехода на данный роут
     * @example false
     */
    isNavVisible?: boolean,

    /**
     * Название или список с названиями моделей, полученных с бэкенда
     */
    models?: string | string[],

    /**
     * Название или список с названиями перечислений, полученных с бэкенда
     */
    enums?: string | string[],

    /**
     * Список с ролями, который показывает, кому из пользователей будет доступен просмотр страницы
     * @example ['user', 'admin']
     */
    roles?: string[],

    /**
     * Обработчик, который возвращает конфигурацию для осуществления HTTP-запроса. Запрос происходит каждый раз
     * перед рендерингом страницы, чтобы получить для неё все необходимые данные
     * @param {*} props
     * @return {Object} Например, {url: '/api/v1/some-data', key: 'someData'}
     */
    fetch?: IFetchHocConfigFunc,

    /**
     * Вложенные роуты
     */
    items?: IRouteItem[] | {[key: string]: IRouteItem};

    /**
     * Обработчик, который принимает параметры URL и возвращает массив с пропсами для хука useFetch и компонента
     * List.
     * Функция запускается перед рендерингом приложения в режиме SSR и используется для предварительной
     * загрузки данных, необходимых на текущей странице.
     * Хук useFetch и компонент List не будут повторно инициализироваться и делать запросы на клиенте,
     * если подгруженные данные существуют.
     * @param {Object} match
     * @return {Array} Например, [{url: '/api/v1/some-data'}, {listId: 'someList', action: '/api/v1/some-list'}]
     */
    preloadData?: (match: Record<string, any>) => (IFetchConfig | IListProps)[],

    [key: string]: any,
}

export interface IRouterProps {
    /**
     * Общий шаблон, который оборачивает страницы приложения
     * @example Layout
     */
    wrapperView?: any;

    /**
     * Свойства шаблона
     */
    wrapperProps?: any;

    /**
     * Дерево роутов
     * @example {id: 'root', path: '/', component: IndexPage, items: [...]}
     */
    routes?: IRouteItem[] | {[key: string]: IRouteItem};

    /**
     * Если у роута не задано свойство roles, которое определяет, кому из пользователей будет доступен контент
     * на соответствующей странице, то подставится стандартный список с ролями
     * @example [null, 'user', 'admin']
     */
    defaultRoles?: string[];

    /**
     * Прокрутить страницу к началу при смене url
     * @example true
     */
    autoScrollTop?: boolean;

    /**
     * Контент, который отобразится под каждой страницей приложения
     * @example SomeComponent
     */
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

function Router(props: IRouterProps): JSX.Element {
    const components = useComponents();

    const {isInitialized, pathname, route, routeParams, activePath, activeRouteIds} = useSelector(state => ({
        isInitialized: isRouterInitialized(state),
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
