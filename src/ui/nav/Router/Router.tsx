import {ReduxRouter} from '@lagunovsky/redux-react-router';
import _get from 'lodash-es/get';
import _isEqual from 'lodash-es/isEqual';
import _pick from 'lodash-es/pick';
import {ReactElement, ReactNode, useEffect, useMemo, useState} from 'react';
import {HashRouter, Navigate, StaticRouter} from 'react-router';
import {useEffectOnce, usePrevious, usePreviousDistinct, useUpdateEffect} from 'react-use';

import {findRedirectPathRecursive, treeToList, walkRoutesRecursive} from './helpers';
import {closeModal, openModal} from '../../../actions/modal';
import {goToRoute, initParams, initRoutes} from '../../../actions/router';
import {useComponents, useSelector} from '../../../hooks';
import useDispatch from '../../../hooks/useDispatch';
import {IFetchConfig} from '../../../hooks/useFetch';
import useSsr from '../../../hooks/useSsr';
import {IStaticContext} from '../../../providers/SsrProvider';
import {getOpened} from '../../../reducers/modal';
import {buildUrl, getActiveRouteIds, getRoute, getRouteParams, isRouterInitialized, matchPath} from '../../../reducers/router';
import {IListProps} from '../../list/List/List';

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
    items?: IRouteItem[] | {[key: string]: IRouteItem},

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
    icon?: ReactElement | string,
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
    routes: IRouteItem[] | IRouteItem | {[key: string]: IRouteItem},

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
    children?: ReactNode,

    /**
     * Флаг, который позволяет использовать вложенные роуты c указанием вложенного пути
     * @example true
     */
    alwaysAppendParentRoutePath?: boolean,
}

const renderComponent = (route: IRouteItem, activePath, routeProps, alwaysAppendParentRoutePath, staticContext: IStaticContext) => {
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
        const toPath = (
            alwaysAppendParentRoutePath
                ? redirectPath
                : buildUrl(redirectPath, routeProps?.match?.params)
        );
        if (activePath !== toPath) {
            // <Navigate> only performs the actual navigation as a useEffect, which never runs
            // during SSR's renderToString() - so, same as before, the SSR response has to learn
            // about the redirect through the mutated static context, not through rendered output
            if (process.env.IS_SSR && staticContext) {
                staticContext.action = 'REPLACE';
                staticContext.url = toPath;
            }

            return (
                <Navigate
                    to={toPath}
                    replace
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
    const {staticContext} = useSsr();

    const {isInitialized, pathname, route, activePath, activeRouteIds, routeMatch} = useSelector(state => ({
        isInitialized: isRouterInitialized(state),
        pathname: _get(state, 'router.location.pathname'),
        route: getRoute(state),
        activePath: state.router?.location?.pathname,
        activeRouteIds: getActiveRouteIds(state),
        routeMatch: _get(state, 'router.match'),
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
                        props.defaultRoles ? {
                            roles: props.defaultRoles,
                        } : undefined,
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
        setRoutes(treeToList(props.routes, true, null, props.alwaysAppendParentRoutePath));
    }, [props.alwaysAppendParentRoutePath, props.routes]);

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
        let hasExact = false;
        activeRouteIds.find(activeRouteId => {
            if (activeRouteId === routeItem.id) {
                // Stop
                return true;
            }

            const activeRoute = routes.find(r => r.id === activeRouteId);
            if (!hasExact && activeRoute.component && !activeRoute.redirectTo) {
                children = renderComponent(
                    activeRoute,
                    activePath,
                    {
                        ...routeProps,
                        children,
                    },
                    props.alwaysAppendParentRoutePath,
                    staticContext,
                ) || children;
            }

            // Stop, if route is exact
            if (activeRoute.exact) {
                hasExact = true;
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
            staticContext,
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
        // activeRouteIds includes ancestors of the active leaf too (e.g. for breadcrumbs/nav
        // highlighting), so it can't be used to pick the entry point here - an ancestor whose own
        // path no longer strictly matches (e.g. a redirect-only gateway route) must be skipped,
        // exactly like <Switch> used to skip it. `routes` is root-first, so the first item whose
        // own path strictly matches is the same one <Switch> would previously have matched first
        const entryRouteItem = routes.find(routeItem => (
            !!matchPath(activePath, _pick(routeItem, ['exact', 'strict', 'path']))
        )) || null;
        const routeProps = {
            match: routeMatch,
            location: components.store.history.location,
            history: components.store.history,
        };
        const routeNodes = (
            <>
                {entryRouteItem && renderItem(entryRouteItem, routeProps)}
                {props.children}
            </>
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
            <StaticRouter location={components.store.history.location}>
                {renderContent()}
            </StaticRouter>
        );
    } if (window.location.protocol === 'file:') {
        return (
            <HashRouter>
                {renderContent()}
            </HashRouter>
        );
    }
    return (
        <ReduxRouter history={components.store.history}>
            {renderContent()}
        </ReduxRouter>
    );
}

Router.defaultProps = {
    autoScrollTop: true,
    alwaysAppendParentRoutePath: true,
};

export default Router;
