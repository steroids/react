import {
    getActiveRouteIds,
    getRoute,
    getRouteId,
    getRouteParams,
    getRouteParam,
    getRouteProp,
    getRouterParams,
    getRoutesMap,
    IRouterInitialState,
    getRouteChildren,
    getRouteBreadcrumbs,
    getRouteParent,
    isRouterInitialized,
} from '../../../src/reducers/router';
import {IRouteItem} from '../../../src/ui/nav/Router/Router';

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

    const getStateWithRouterData = (
        routerData: Record<string, any> = {},
    ) => ({
        router: {
            ...initialState,
            ...routerData,
        },
    });

    beforeEach(() => {
        initialState = {...defaultInitialState};
    });

    describe('isRouterInitialized', () => {
        it('without routesTree', () => {
            const state = getStateWithRouterData();
            const expectedIsInitialized = false;
            expect(isRouterInitialized(state)).toBe(expectedIsInitialized);
        });

        it('with routesTree', () => {
            const state = getStateWithRouterData({routesTree: {}});
            const expectedIsInitialized = true;
            expect(isRouterInitialized(state)).toBe(expectedIsInitialized);
        });
    });

    describe('getRouterParams', () => {
        it('default behavior', () => {
            const params = {
                query: {
                    search: 'bamboo',
                },
            };

            const state = getStateWithRouterData({params});
            expect(getRouterParams(state)).toEqual(params);
        });
    });

    describe('getActiveRouteIds', () => {
        it('with activeIds', () => {
            const activeIds = ['dashboard', 'personal_area', 'error', 'root'];
            const state = getStateWithRouterData({activeIds});
            expect(getActiveRouteIds(state)).toEqual(activeIds);
        });

        it('without activeIds', () => {
            const state = getStateWithRouterData();
            const emptyActiveIds = null;
            expect(getActiveRouteIds(state)).toEqual(emptyActiveIds);
        });
    });

    describe('getRoutesMap', () => {
        it('with routesMap', () => {
            const routesMap = {
                home: {
                    id: '2',
                    exact: true,
                },
            };

            const state = getStateWithRouterData({routesMap});
            expect(getRoutesMap(state)).toEqual(routesMap);
        });

        it('without routesMap', () => {
            const state = getStateWithRouterData();
            const emptyRoutesMap = null;
            expect(getRoutesMap(state)).toEqual(emptyRoutesMap);
        });
    });

    describe('getRouteId', () => {
        it('with activeIds', () => {
            const activeIds = ['dashboard', 'personal_area', 'error', 'root'];
            const state = getStateWithRouterData({activeIds});
            const expectedRouteId = 'dashboard';
            expect(getRouteId(state)).toEqual(expectedRouteId);
        });

        it('without activeIds', () => {
            const state = getStateWithRouterData();
            const emptyRoute = null;
            expect(getRouteId(state)).toEqual(emptyRoute);
        });
    });

    describe('getRoute', () => {
        it('with routeId', () => {
            const routeId = 'dashboard';
            const route: IRouteItem = {
                id: routeId,
                path: '/',
                exact: true,
            };

            const routesMap = {
                [routeId]: route,
            };

            const state = getStateWithRouterData({routesMap});
            expect(getRoute(state, routeId)).toEqual(route);
        });

        it('without routeId', () => {
            const routeId = 'dashboard';
            const route: IRouteItem = {
                path: '/',
                exact: true,
            };

            const routesMap = {
                [routeId]: route,
            };

            const activeIds = [routeId];
            const state = getStateWithRouterData({
                routesMap,
                activeIds,
            });
            expect(getRoute(state)).toEqual(route);
        });

        it('without routesMap', () => {
            const routeId = 'home';
            const state = getStateWithRouterData();
            const emptyRoute = null;
            expect(getRoute(state, routeId)).toEqual(emptyRoute);
        });
    });

    describe('getRouteProp', () => {
        const getRoutesMapMock = (routeName: string, routeValue: Record<string, any>) => ({
            [routeName]: routeValue,
        });

        it('with prop', () => {
            const propValue = true;
            const propName = 'exact';
            const routeId = 'dashboard';

            const route: IRouteItem = {
                id: routeId,
                path: '/',
                [propName]: propValue,
            };

            const routesMap = getRoutesMapMock(routeId, route);
            const state = getStateWithRouterData({routesMap});
            expect(getRouteProp(state, routeId, propName)).toBe(propValue);
        });

        it('with not existing prop', () => {
            const notExistingPropName = 'exact';
            const routeId = 'dashboard';

            const route: IRouteItem = {
                id: routeId,
                path: '/',
            };

            const routesMap = getRoutesMapMock(routeId, route);
            const state = getStateWithRouterData({routesMap});
            const emptyPropValue = null;
            expect(getRouteProp(state, routeId, notExistingPropName)).toBe(emptyPropValue);
        });
    });

    describe('getRouteParams', () => {
        const match = {
            path: 'home',
            isExact: 'true',
            url: 'https://megasite.com',
        };

        it('with params', () => {
            const params = {
                param1: 'param1',
            };

            const matchWithParams = {
                ...match,
                params,
            };

            const state = getStateWithRouterData({match: matchWithParams});
            expect(getRouteParams(state)).toEqual(params);
        });

        it('without params', () => {
            const state = getStateWithRouterData({match});
            const emptyParams = null;
            expect(getRouteParams(state)).toEqual(emptyParams);
        });
    });

    describe('getRouteParam', () => {
        const match = {
            path: 'home',
            isExact: 'true',
            url: 'https://megasite.com',
        };

        it('with correct param', () => {
            const paramName = 'paramName';
            const paramValue = 'paramValue';

            const matchWithParams = {
                ...match,
                params: {
                    [paramName]: paramValue,
                },
            };

            const state = getStateWithRouterData({match: matchWithParams});
            expect(getRouteParam(state, paramName)).toBe(paramValue);
        });

        it('with incorrect param', () => {
            const notExistingParamName = 'exact';

            const matchWithParams = {
                ...match,
                params: {
                    strict: true,
                },
            };

            const state = getStateWithRouterData({match: matchWithParams});
            const emptyParamValue = null;
            expect(getRouteParam(state, notExistingParamName)).toBe(emptyParamValue);
        });
    });

    it('getRouteBreadcrumbs', () => {
        const routeId = 'childRoute';

        const childRoute: IRouteItem = {
            id: routeId,
            label: 'childRoute',
            path: '/child',
            isVisible: true,
            isNavVisible: true,
            items: [],
        };

        const parentRoute: IRouteItem = {
            id: 'parentRoute',
            label: 'parentRoute',
            path: '/',
            isVisible: true,
            isNavVisible: true,
            items: [childRoute],
        };

        const state = getStateWithRouterData({routesTree: parentRoute});
        const expectedRouteBreadcrumbs = [parentRoute, childRoute];
        expect(getRouteBreadcrumbs(state, routeId)).toEqual(expectedRouteBreadcrumbs);
    });

    describe('getRouteChildren', () => {
        it('with items', () => {
            const routeParentId = 'routeParent';
            const routeChildren = [{
                id: 'routeChild',
                exact: true,
            }];

            const routesMap = {
                [routeParentId]: {
                    id: routeParentId,
                    exact: true,
                    items: routeChildren,
                },
            };

            const state = getStateWithRouterData({routesMap});
            expect(getRouteChildren(state, routeParentId)).toEqual(routeChildren);
        });

        it('without items', () => {
            const routeParentId = 'dashboard';

            const routesMap = {
                [routeParentId]: {
                    id: routeParentId,
                    exact: true,
                },
            };

            const state = getStateWithRouterData({routesMap});
            const emptyRouteChildren = null;
            expect(getRouteChildren(state, routeParentId)).toEqual(emptyRouteChildren);
        });
    });

    describe('getRouteParent', () => {
        const routeChildId = 'routeChild';

        const routeChild = {
            id: routeChildId,
            label: 'desired route',
            isNavVisible: true,
            isVisible: true,
            items: [],
        };

        const routeParent = {
            id: 'routeParent',
            isNavVisible: true,
            isVisible: true,
            items: [routeChild],
        };

        const routesMap = {
            [routeParent.id]: routeParent,
            [routeChild.id]: routeChild,
        };

        const state = getStateWithRouterData({
            routesMap,
            routesTree: routeParent,
        });

        it('with correct level', () => {
            const level = 1;
            const expectedRouteParent = routeParent;
            expect(getRouteParent(state, routeChildId, level)).toEqual(expectedRouteParent);
        });

        it('with incorrect level', () => {
            const level = 2;
            const emptyRouteParent = null;
            expect(getRouteParent(state, routeChildId, level)).toBe(emptyRouteParent);
        });
    });
});
