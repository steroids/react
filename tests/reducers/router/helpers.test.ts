import {
    IRouterInitialState,
    buildUrl,
    checkIsActive,
    normalizeRoutes,
    findRecursive,
    getMatch,
} from '../../../src/reducers/router';
import {IRouteItem} from '../../../src/ui/nav/Router/Router';

const originalEnv = process.env;

describe('router reducers', () => {
    const defaultInitialState: IRouterInitialState = {
        location: null,
        routesTree: null,
        routesMap: null,
        activeIds: null,
        match: null,
        params: {},
        configs: [],
        data: {},
        counters: {},
    };

    let initialState = {
        ...defaultInitialState,
    };

    const getStateWithRoutesMap = (routesMap: Record<string, any>) => ({
        ...initialState,
        routesMap: {
            ...routesMap,
        },
    });

    beforeEach(() => {
        initialState = {
            ...defaultInitialState,
        };
        jest.resetModules();
        process.env = {
            ...originalEnv,
        };
    });

    describe('buildUrl', () => {
        const path = '/home/contacts/physics';

        it('with params', () => {
            const params = {
                search: 'Ivan',
            };
            const expectedUrl = '/home/contacts/physics?search=Ivan';
            expect(buildUrl(path, params)).toBe(expectedUrl);
        });

        it('without params', () => {
            expect(buildUrl(path)).toBe(path);
        });
    });

    describe('checkIsActive', () => {
        //TODO checkIsActive with file protocol
        it('not SSR without file protocol', () => {
            const pathname = 'home/contacts/it';
            global.window.location.protocol = 'http:';

            const item = {
                exact: true,
                strict: true,
                path: pathname,
            };

            const state: IRouterInitialState = {
                ...initialState,
                location: {
                    hash: '',
                    query: null,
                    search: '',
                    pathname,
                },
            };

            const expectedIsActive = true;
            expect(checkIsActive(state, item)).toBe(expectedIsActive);
        });

        it('exact:false matches a pathname that only starts with the route path', () => {
            global.window.location.protocol = 'http:';

            const item = {
                exact: false,
                strict: false,
                path: '/home',
            };

            const state: IRouterInitialState = {
                ...initialState,
                location: {
                    hash: '',
                    query: null,
                    search: '',
                    pathname: '/home/contacts',
                },
            };

            expect(checkIsActive(state, item)).toBe(true);
        });

        it('exact:true does not match a pathname that only starts with the route path', () => {
            global.window.location.protocol = 'http:';

            const item = {
                exact: true,
                strict: false,
                path: '/home',
            };

            const state: IRouterInitialState = {
                ...initialState,
                location: {
                    hash: '',
                    query: null,
                    search: '',
                    pathname: '/home/contacts',
                },
            };

            expect(checkIsActive(state, item)).toBe(false);
        });

        it('exact:true, strict:false ignores a trailing slash on the pathname', () => {
            global.window.location.protocol = 'http:';

            const item = {
                exact: true,
                strict: false,
                path: '/home',
            };

            const state: IRouterInitialState = {
                ...initialState,
                location: {
                    hash: '',
                    query: null,
                    search: '',
                    pathname: '/home/',
                },
            };

            expect(checkIsActive(state, item)).toBe(true);
        });

        it('strict:true requires the trailing slash declared on the route path to be present', () => {
            global.window.location.protocol = 'http:';

            const item = {
                exact: true,
                strict: true,
                path: '/home/',
            };

            const state: IRouterInitialState = {
                ...initialState,
                location: {
                    hash: '',
                    query: null,
                    search: '',
                    pathname: '/home',
                },
            };

            expect(checkIsActive(state, item)).toBe(false);
        });

        it('does not match a completely different pathname', () => {
            global.window.location.protocol = 'http:';

            const item = {
                exact: true,
                strict: false,
                path: '/home',
            };

            const state: IRouterInitialState = {
                ...initialState,
                location: {
                    hash: '',
                    query: null,
                    search: '',
                    pathname: '/contacts',
                },
            };

            expect(checkIsActive(state, item)).toBe(false);
        });
    });

    describe('normalizeRoutes', () => {
        const component = () => null;
        const dashboard = 'dashboard';
        const information = 'information';
        const activeIds = [dashboard, information];

        const getExpectedRoutesMap = (routesMap, route, expectedRoutesTree) => ({
            ...routesMap,
            [route.id]: expectedRoutesTree,
        });

        const getExpectedRoutesTree = (route, items) => ({
            ...route,
            component: null,
            icon: null,
            roles: [],
            items,
        });

        const routesMap = {
            [dashboard]: {
                id: dashboard,
                component,
            },
            [information]: {
                id: information,
                component,
            },
        };

        const state = getStateWithRoutesMap(routesMap);

        const routeWithoutChildren = {
            id: 'routeWithoutChildren',
            title: 'routeWithoutChildren',
            label: 'routeWithoutChildren',
            exact: true,
            strict: true,
            path: 'home/contacts/routeWithoutChildren',
            isVisible: true,
            isNavVisible: true,
            component,
            componentProps: null,
        };

        it('without items', () => {
            const expectedRoutesTree = getExpectedRoutesTree(routeWithoutChildren, null);
            const expectedRoutesMap = getExpectedRoutesMap(routesMap, routeWithoutChildren, expectedRoutesTree);
            expect(normalizeRoutes(state, routeWithoutChildren, activeIds, routesMap)).toEqual(expectedRoutesTree);
            expect(routesMap).toEqual(expectedRoutesMap);
        });

        it('with items as object', () => {
            const childRoute = 'childRoute';

            const items = {
                [childRoute]: {
                    id: childRoute,
                    exact: true,
                } as IRouteItem,
            };

            const routeWithChildren = {
                ...routeWithoutChildren,
                items,
            };

            const expectedRoutesTree = getExpectedRoutesTree(routeWithChildren, [
                {
                    ...normalizeRoutes(
                        state,
                        items[childRoute],
                        activeIds,
                        routesMap,
                    ),
                    id: childRoute,
                },
            ]);

            const expectedRoutesMap = getExpectedRoutesMap(routesMap, routeWithChildren, expectedRoutesTree);
            expect(normalizeRoutes(state, routeWithChildren, activeIds, routesMap)).toEqual(expectedRoutesTree);
            expect(routesMap).toEqual(expectedRoutesMap);
        });

        it('with items as array', () => {
            const childRoute = {
                id: 'childRoute',
                exact: true,
            } as IRouteItem;
            const routeWithChildren = {
                ...routeWithoutChildren,
                items: [childRoute],
            };

            const expectedRoutesTree = getExpectedRoutesTree(routeWithChildren, [
                {
                    ...normalizeRoutes(
                        state,
                        childRoute,
                        activeIds,
                        routesMap,
                    ),
                },
            ]);

            const expectedRoutesMap = getExpectedRoutesMap(routesMap, routeWithChildren, expectedRoutesTree);
            expect(normalizeRoutes(state, routeWithChildren, activeIds, routesMap)).toEqual(expectedRoutesTree);
            expect(routesMap).toEqual(expectedRoutesMap);
        });
    });

    describe('findRecursive', () => {
        const defaultPathItems = [
            {
                id: 'someRoute1',
                path: '/some-route1',
                label: 'someRoute1',
            },
            {
                id: 'someRoute2',
                path: '/some-route2',
                label: 'someRoute2',
            },
        ];

        it('with predicate as parentRoute id', () => {
            const parentRouteId = 'parentRoute';

            const pathItems = [...defaultPathItems];

            const parentRoute = {
                id: parentRouteId,
                path: '/',
                label: 'parentRoute',
            };

            const expectedPathItems = pathItems.concat([parentRoute]);
            expect(findRecursive(parentRoute, parentRouteId, pathItems)).toEqual(parentRoute);
            expect(pathItems).toEqual(expectedPathItems);
        });

        it('with predicate as parentRoute id, without pathItems', () => {
            const parentRouteId = 'parentRoute';

            const parentRoute: IRouteItem = {
                id: parentRouteId,
                path: '/',
                label: 'parentRoute',
            };

            expect(findRecursive(parentRoute, parentRouteId)).toEqual(parentRoute);
        });

        it('without predicate and childrenRoutes array', () => {
            const emptyPredicate = '';

            const parentRoute: IRouteItem = {
                id: 'parentRoute',
                path: '/',
                label: 'parentRoute',
            };

            const emptyRoute = null;
            expect(findRecursive(parentRoute, emptyPredicate)).toEqual(emptyRoute);
        });
        it('with childrenRoutes array and pathItems', () => {
            const routeId = 'parentRoute';
            const deepChildRouteId = 'deepRoute';

            const pathItems = [...defaultPathItems];

            const deepChildRoute = {
                id: deepChildRouteId,
                path: '/child/child2',
                label: 'deepChildRoute',
            };

            const childRoute = {
                id: 'childRoute',
                label: 'childRoute',
                path: '/child',
                items: [deepChildRoute],
            };

            const parentRoute = {
                id: routeId,
                label: 'parentRoute',
                path: '/',
                items: [childRoute],
            };

            const expectedPathItems = pathItems.concat([deepChildRoute, childRoute, parentRoute]);
            expect(findRecursive(parentRoute, deepChildRouteId, pathItems)).toEqual(childRoute);
            expect(pathItems).toEqual(expectedPathItems);
        });
    });

    describe('getMatch', () => {
        it('without currentRoute', () => {
            const currentRoute = null;

            const state: IRouterInitialState = {
                ...initialState,
            };

            const emptyMatch = null;
            expect(getMatch(currentRoute, state)).toBe(emptyMatch);
        });

        it('with currentRoute', () => {
            const path = '/home/contacts';

            const currentRoute = {
                id: 'currentRoute',
                exact: true,
                strict: false,
                path,
            };

            const state: IRouterInitialState = {
                ...initialState,
                location: {
                    pathname: path,
                    hash: '',
                    query: {
                        query1: 'query1',
                    },
                    search: '',
                },
            };

            const expectedMatch = {
                path,
                url: path,
                isExact: true,
                params: {
                    ...state.location?.query,
                },
            };

            expect(getMatch(currentRoute, state)).toEqual(expectedMatch);
        });

        it('with route params extracted from a dynamic path segment', () => {
            const currentRoute = {
                id: 'currentRoute',
                exact: true,
                strict: false,
                path: '/users/:id',
            };

            const state: IRouterInitialState = {
                ...initialState,
                location: {
                    pathname: '/users/42',
                    hash: '',
                    query: {},
                    search: '',
                },
            };

            const expectedMatch = {
                path: '/users/:id',
                url: '/users/42',
                isExact: true,
                params: {
                    id: '42',
                },
            };

            expect(getMatch(currentRoute, state)).toEqual(expectedMatch);
        });

        it('returns null when the route path does not match the current pathname', () => {
            const currentRoute = {
                id: 'currentRoute',
                exact: true,
                strict: false,
                path: '/home',
            };

            const state: IRouterInitialState = {
                ...initialState,
                location: {
                    pathname: '/contacts',
                    hash: '',
                    query: {},
                    search: '',
                },
            };

            expect(getMatch(currentRoute, state)).toBe(null);
        });
    });

    afterEach(() => {
        process.env = originalEnv;
    });
});
