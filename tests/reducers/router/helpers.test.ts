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

    let initialState = {...defaultInitialState};

    const getStateWithRoutesMap = (routesMap: Record<string, any>) => ({
        ...initialState,
        routesMap: {...routesMap}
    });

    beforeEach(() => {
        initialState = {...defaultInitialState};
        jest.resetModules();
        process.env = {...originalEnv};
    });

    describe('buildUrl', () => {
        const path = '/home/contacts/physics';

        it('with params', () => {
            const params = {search: 'Ivan'};
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

            const routeWithChildren = {...routeWithoutChildren, items};

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
            const childRoute = {id: 'childRoute', exact: true} as IRouteItem;
            const routeWithChildren = {
                ...routeWithoutChildren,
                items: [childRoute]
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
            {id: 'someRoute1', label: 'someRoute1'},
            {id: 'someRoute2', label: 'someRoute2'},
        ];

        it('with predicate as parentRoute id', () => {
            const parentRouteId = 'parentRoute';

            const pathItems = [...defaultPathItems];

            const parentRoute = {
                id: parentRouteId,
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
                label: 'parentRoute',
            };

            expect(findRecursive(parentRoute, parentRouteId)).toEqual(parentRoute);
        });

        it('without predicate and childrenRoutes array', () => {
            const emptyPredicate = '';

            const parentRoute: IRouteItem = {
                id: 'parentRoute',
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
                label: 'deepChildRoute',
            };

            const childRoute = {
                id: 'childRoute',
                label: 'childRoute',
                items: [deepChildRoute],
            };

            const parentRoute = {
                id: routeId,
                label: 'parentRoute',
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
    });

    afterEach(() => {
        process.env = originalEnv;
    });
});
