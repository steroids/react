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
} from '../../../src/reducers/router';
import {IRouteItem} from '../../../src/ui/nav/Router/Router';

describe('router reducers', () => {
    const defaultInitialState: IRouterInitialState = {
        location: null,
        routesTree: null,
        routesMap: null,
        activeIds: null,
        currentId: null,
        match: null,

        params: {},
        configs: [],
        data: {},
        counters: {},
    };

    let initialState = {...defaultInitialState};

    const getStateWithRouterData = (
        routerData: Record<string, any> | null = null,
    ) => ({
        router: {
            ...initialState,
            ...routerData,
        },
    });

    beforeEach(() => {
        initialState = {...defaultInitialState};
    });

    describe('getRouterParams', () => {
        it('with params', () => {
            const params = {
                query: {
                    search: 'bamboo',
                },
            };

            const state = getStateWithRouterData({params});

            const expectedResult = params;

            expect(getRouterParams(state)).toEqual(expectedResult);
        });

        it('without params', () => {
            const params = null;

            const state = getStateWithRouterData({params});

            const expectedResult = params;

            expect(getRouterParams(state)).toEqual(expectedResult);
        });
    });

    describe('getActiveRouteIds', () => {
        it('with activeIds', () => {
            const activeIds = ['dashboard', 'personal_area', 'error', 'root'];

            const state = getStateWithRouterData({activeIds});

            expect(getActiveRouteIds(state)).toEqual(activeIds);
        });

        it('without activeIds', () => {
            const state = getStateWithRouterData({activeIds: null});

            const expectedResult = null;

            expect(getActiveRouteIds(state)).toEqual(expectedResult);
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
            const state = getStateWithRouterData({});

            const expectedResult = null;

            expect(getRoutesMap(state)).toEqual(expectedResult);
        });
    });

    describe('getRouteId', () => {
        it('with activeIds', () => {
            const activeIds = ['dashboard', 'personal_area', 'error', 'root'];

            const state = getStateWithRouterData({activeIds});

            const expectedResult = 'dashboard';

            expect(getRouteId(state)).toEqual(expectedResult);
        });

        it('without activeIds', () => {
            const state = getStateWithRouterData({activeIds: null});

            const expectedResult = null;

            expect(getRouteId(state)).toEqual(expectedResult);
        });
    });

    describe('getRoute', () => {
        it('with routeId', () => {
            const routeId = 'dashboard';
            const route: IRouteItem = {
                id: '1',
                exact: true,
            };

            const routesMap = {
                [routeId]: route,
            };

            const state = getStateWithRouterData({routesMap});

            expect(getRoute(state, routeId)).toEqual(route);
        });

        it('without routeId', () => {
            const route: IRouteItem = {
                id: '1',
                exact: true,
            };

            const routesMap = {
                dashboard: route,
            };

            const activeIds = ['dashboard'];

            const state = getStateWithRouterData({routesMap, activeIds});

            expect(getRoute(state)).toEqual(route);
        });

        it('without routesMap', () => {
            const routeId = 'home';

            const state = getStateWithRouterData({});

            const expectedResult = null;

            expect(getRoute(state, routeId)).toEqual(expectedResult);
        });
    });

    describe('getRouteProp', () => {
        it('with prop', () => {
            const propValue = true;
            const propName = 'exact';
            const routeId = 'dashboard';

            const route: IRouteItem = {
                id: '1',
                [propName]: propValue,
            };

            const routesMap = {
                dashboard: route,
            };

            const state = getStateWithRouterData({routesMap});

            expect(getRouteProp(state, routeId, propName)).toBe(propValue);
        });
        it('with not existing prop', () => {
            const propName = 'exact';
            const routeId = 'dashboard';

            const route: IRouteItem = {
                id: '1',
            };

            const routesMap = {
                [routeId]: route,
            };

            const state = getStateWithRouterData({routesMap});

            const expectedResult = null;

            expect(getRouteProp(state, routeId, propName)).toBe(expectedResult);
        });
    });

    describe('getRouteParams', () => {
        it('with params', () => {
            const params = {
                param1: 'param1',
            };

            const match = {
                params,
                path: 'home',
                isExact: 'true',
                url: 'https://megasite.com',
            };

            const state = getStateWithRouterData({match});

            expect(getRouteParams(state)).toEqual(params);
        });

        it('without params', () => {
            const match = {
                params: null,
                path: 'home',
                isExact: 'true',
                url: 'https://megasite.com',
            };

            const state = getStateWithRouterData({match});

            const expectedResult = null;

            expect(getRouteParams(state)).toEqual(expectedResult);
        });
    });

    describe('getRouteParam', () => {
        it('with correct param', () => {
            const paramName = 'param1';
            const params = {
                [paramName]: 'param1',
            };

            const match = {
                params,
                path: 'home',
                isExact: 'true',
                url: 'https://megasite.com',
            };

            const state = getStateWithRouterData({match});

            const expectedResult = params[paramName];

            expect(getRouteParam(state, paramName)).toBe(expectedResult);
        });

        it('with incorrect param', () => {
            const paramName = 'param2';

            const match = {
                params: {
                    param1: 'param1',
                },
                path: 'home',
                isExact: 'true',
                url: 'https://megasite.com',
            };

            const state = getStateWithRouterData({match});

            const expectedResult = null;

            expect(getRouteParam(state, paramName)).toBe(expectedResult);
        });
    });

    it('getRouteBreadcrumbs', () => {
        const routeId = '2';

        const route: IRouteItem = {
            id: routeId,
            label: 'childrenRoute1',
            isVisible: true,
            isNavVisible: true,
            items: [],
        };

        const parentRoute: IRouteItem = {
            id: '1',
            label: 'parentRoute',
            isVisible: true,
            isNavVisible: true,
            items: [route],
        };

        const state = getStateWithRouterData({routesTree: parentRoute});

        const expectedResult = [parentRoute, route];

        expect(getRouteBreadcrumbs(state, routeId)).toEqual(expectedResult);
    });

    describe('getRouteChildren', () => {
        it('with items', () => {
            const routeId = 'dashboard';
            const routeChildren = [{id: '1', exact: true}];

            const routesMap = {
                dashboard: {
                    id: '1',
                    exact: true,
                    items: routeChildren,
                },
            };

            const state = getStateWithRouterData({routesMap});

            expect(getRouteChildren(state, routeId)).toEqual(routeChildren);
        });

        it('without items', () => {
            const routeId = 'dashboard';

            const routesMap = {
                dashboard: {
                    id: '1',
                    exact: true,
                },
            };

            const state = getStateWithRouterData({routesMap});

            const expectedResult = null;

            expect(getRouteChildren(state, routeId)).toEqual(expectedResult);
        });
    });

    describe('getRouteParent', () => {
        const routeId = '3';

        const routeItem2 = {
            id: '3',
            isNavVisible: true,
            isVisible: true,
            items: [],
        };
        const routeItem1 = {
            id: '2',
            label: 'desired route',
            isNavVisible: true,
            isVisible: true,
            items: [routeItem2],
        };

        const parentRoute = {
            id: '1',
            isNavVisible: true,
            isVisible: true,
            items: [routeItem1],
        };

        const routesMap = {
            [parentRoute.id]: parentRoute,
            [routeItem1.id]: routeItem1,
            [routeItem2.id]: routeItem2,
        };

        const state = getStateWithRouterData({
            routesMap,
            routesTree: parentRoute,
        });

        it('with correct level', () => {
            const level = 2;
            const expectedResult = parentRoute.items && parentRoute.items[0];

            expect(getRouteParent(state, routeId, level)).toEqual(
                expectedResult,
            );
        });

        it('with incorrect level', () => {
            const level = 3;
            const expectedResult = null;

            expect(getRouteParent(state, routeId, level)).toBe(expectedResult);
        });
    });
});
