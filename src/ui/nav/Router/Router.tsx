import React, {useEffect, useMemo, useState} from 'react';
import {Route, Switch, Redirect, StaticRouter} from 'react-router';
import {HashRouter} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router';
import _get from 'lodash-es/get';
import _isEqual from 'lodash-es/isEqual';
import {useEffectOnce, usePrevious, usePreviousDistinct, useUpdateEffect} from 'react-use';
import {closeModal, openModal} from '../../../actions/modal';
import {getOpened} from '../../../reducers/modal';
import {IFetchConfig} from '../../../hooks/useFetch';
import {IListProps} from '../../list/List/List';
import {useComponents, useSelector} from '../../../hooks';
import {goToRoute, initParams, initRoutes} from '../../../actions/router';
import useDispatch from '../../../hooks/useDispatch';
import {buildUrl, getActiveRouteIds, getRoute, getRouteParams, isRouterInitialized} from '../../../reducers/router';
import {SsrProviderContext} from '../../../providers/SsrProvider';
import {findRedirectPathRecursive, treeToList, walkRoutesRecursive} from './helpers';

export const ROUTER_ROLE_LOGIN = 'login';
export const ROUTER_ROLE_MODAL = 'modal';
export const ROUTER_ROLE_404 = '404';

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
    path: string,

    /**
     * Если true, то путь должен точно соответствовать location.pathname
     * @example '/catalog'
     */
    exact?: boolean,

    /**
     * Если true, то location.pathname будет совпадать с теми путями, которые содержат слеш в конце.
     * Например, если указать путь '/catalog/', тогда совпадение будет с '/catalog/' и '/catalog/chapter', но не '/catalog'.
     * @example '/catalog'
     */
    strict?: boolean,

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
     * Назначение страницы, указывается, чтобы приложение автоматически могло найти страницу авторизации или 404-ю..
     * @example 'login'
     */
    role?: 'login' | 'modal' | '404' | string,

    /**
     * Список с ролями, который показывает, кому из пользователей будет доступен просмотр страницы
     * @example ['user', 'admin']
     */
    roles?: Array<string | null>,

    /**
     * Вложенные роуты
     */
    items?: IRouteItem[] | {[key: string]: IRouteItem,},

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

    /**
     * Пользовательская иконка svg или название иконки
     * @example 'circle'
     */
    icon?: React.ReactElement | string,
}

export interface IRouterProps {
    /**
     * Общий шаблон, который оборачивает страницы приложения
     * @example Layout
     */
    wrapperView?: any,

    /**
     * Свойства шаблона
     */
    wrapperProps?: any,

    /**
     * Дерево роутов
     * @example {id: 'root', path: '/', component: IndexPage, items: [...]}
     */
    routes: IRouteItem[] | IRouteItem | {[key: string]: IRouteItem,},

    /**
     * Если у роута не задано свойство roles, которое определяет, кому из пользователей будет доступен контент
     * на соответствующей странице, то подставится стандартный список с ролями
     * @example [null, 'user', 'admin']
     */
    defaultRoles?: string[],

    /**
     * Прокрутить страницу к началу при смене url
     * @example true
     */
    autoScrollTop?: boolean,

    /**
     * Контент, который отобразится под каждой страницей приложения
     * @example SomeComponent
     */
    children?: React.ReactNode,

    /**
     * Флаг, который позволяет использовать вложенные роуты c указанием вложенного пути
     * @example true
     */
    alwaysAppendParentRoutePath?: boolean,
}

const renderComponent = (route: IRouteItem, activePath, routeProps, alwaysAppendParentRoutePath) => {
    const routePath = buildUrl(route.path, routeProps?.match?.params);

    if (route.redirectTo && routePath === activePath) {
        const redirectPath = alwaysAppendParentRoutePath
            ? findRedirectPathRecursive(route, activePath)
            : findRedirectPathRecursive(route);

        if (redirectPath === null) {
            // eslint-disable-next-line no-console
            console.error('Not found path for redirect in route:', route);
            return null;
        }

        // Check already redirected
        const toPath = buildUrl(redirectPath, routeProps?.match?.params);
        if (activePath !== toPath) {
            return (
                <Redirect
                    {...routeProps}
                    to={toPath}
                    {...route.componentProps}
                />
            );
        }
    }

    if (!route.component) {
        return null;
    }

    const Component = route.component;

    return (
        <Component
            {...routeProps}
            {...route.componentProps}
        />
    );
};

function Router(props: IRouterProps): JSX.Element {
    const components = useComponents();
    const routeParams = useSelector(getRouteParams);

    const {isInitialized, pathname, route, activePath, activeRouteIds} = useSelector(state => ({
        isInitialized: isRouterInitialized(state),
        pathname: _get(state, 'router.location.pathname'),
        route: getRoute(state),
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
                        {
                            id: 'root',
                            ...props.routes,
                        },
                        props.defaultRoles ? {roles: props.defaultRoles} : undefined,
                        {},
                        props.alwaysAppendParentRoutePath,
                    ),
                ),
            );
        }
    });

    // Sync route params with redux
    const prevRouteParams = usePreviousDistinct(routeParams) ?? routeParams;

    useEffect(() => {
        if (!_isEqual(prevRouteParams, routeParams)) {
            dispatch(initParams(routeParams));
        }
    }, [dispatch, prevRouteParams, routeParams]);

    // Routes state
    const [routes, setRoutes] = useState(treeToList(props.routes, true, null, props.alwaysAppendParentRoutePath));
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

    // Check to open/close modals
    const prevRoute = usePrevious(route);
    useUpdateEffect(() => {
        if (prevRoute?.id !== route?.id) {
            if (prevRoute && prevRoute.role === ROUTER_ROLE_MODAL) {
                dispatch(closeModal(prevRoute.id));
            }
            if (route && route.role === ROUTER_ROLE_MODAL) {
                const Component = routes.find(item => item.id === route.id)?.component;
                if (Component) {
                    dispatch(openModal(Component, {
                        modalId: route.id,
                        ...routeParams,
                    }));
                }
            }
        }
    }, [dispatch, prevRoute, route, routeParams, routes]);

    // Check close modal - go to parent page
    const openedModals = useSelector(state => getOpened(state));
    const openedModalIds = useMemo(() => (openedModals || []).map(modal => modal.id), [openedModals]);
    const prevOpenedModalIds = usePrevious(openedModalIds);

    useEffect(() => {
        if (
            prevOpenedModalIds !== openedModalIds
            && route
            && !openedModalIds.includes(route.id)
            && prevRoute?.role === ROUTER_ROLE_MODAL
        ) {
            const parentRouteId = activeRouteIds.find(activeRouteId => {
                const activeRoute = routes.find(routeItem => routeItem.id === activeRouteId);
                return activeRoute && activeRoute.role !== ROUTER_ROLE_MODAL;
            });
            if (parentRouteId) {
                dispatch(goToRoute(parentRouteId, prevRouteParams));
            }
        }
    });

    const renderItem = (routeItem: IRouteItem, routeProps) => {
        let children = null;
        activeRouteIds.find(activeRouteId => {
            if (activeRouteId === routeItem.id) {
                // Stop
                return true;
            }

            const activeRoute = routes.find(r => r.id === activeRouteId);
            children = renderComponent(activeRoute, activePath, {
                ...routeProps,
                children,
            }, props.alwaysAppendParentRoutePath) || children;

            // Stop, if route is exact
            if (activeRoute.exact) {
                return true;
            }

            return false;
        });

        const result = renderComponent(
            routeItem,
            activePath,
            {
                ...routeProps,
                children,
            },
            props.alwaysAppendParentRoutePath,
        );
        if (!result) {
            if (children) {
                return children;
            }
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
    alwaysAppendParentRoutePath: true,
};

export default Router;
