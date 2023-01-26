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
    getMatch,
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

    beforeEach(() => {
        initialState = {...defaultInitialState};
    });
    describe('getMatch', () => {
        it('without currentRoute', () => {
            const currentRoute = null;

            const globalState = {
                router: {...initialState} as IRouterInitialState,
            };

            const expectedResult = null;

            expect(getMatch(currentRoute, globalState)).toBe(expectedResult);
        });

        it('with currentRoute', () => {
            const currentRoute = {
                id: 1,
                exact: true,
                strict: false,
                path: '/home/contacts',
            };

            const globalState = {
                router: {...initialState} as IRouterInitialState,
            };
        });
    });

    describe('getRouterParams', () => {
        it('with params', () => {
            const params = {
                query: {
                    search: 'bamboo',
                },
            };

            const globalState = {
                router: {
                    ...initialState,
                    params,
                } as IRouterInitialState,
            };

            const expectedResult = params;

            expect(getRouterParams(globalState)).toEqual(expectedResult);
        });

        it('without params', () => {
            const params = null;

            const globalState = {
                router: {
                    ...initialState,
                    params,
                } as IRouterInitialState,
            };

            const expectedResult = params;

            expect(getRouterParams(globalState)).toEqual(expectedResult);
        });
    });

    describe('getActiveRouteIds', () => {
        it('with activeIds', () => {
            const activeIds = ['dashboard', 'personal_area', 'error', 'root'];

            const globalState = {
                router: {
                    ...initialState,
                    activeIds,
                } as IRouterInitialState,
            };

            const expectedResult = activeIds;

            expect(getActiveRouteIds(globalState)).toEqual(expectedResult);
        });

        it('without activeIds', () => {
            const globalState = {
                router: {
                    ...initialState,
                    activeIds: null,
                } as IRouterInitialState,
            };

            const expectedResult = null;

            expect(getActiveRouteIds(globalState)).toEqual(expectedResult);
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

            const globalState = {
                router: {
                    ...initialState,
                    routesMap,
                } as IRouterInitialState,
            };

            const expectedResult = routesMap;

            expect(getRoutesMap(globalState)).toEqual(expectedResult);
        });

        it('without routesMap', () => {
            const routesMap = null;

            const globalState = {
                router: {
                    ...initialState,
                    routesMap,
                } as IRouterInitialState,
            };

            const expectedResult = routesMap;

            expect(getRoutesMap(globalState)).toEqual(expectedResult);
        });
    });

    describe('getRouteId', () => {
        it('with activeIds', () => {
            const globalState = {
                router: {
                    ...initialState,
                    activeIds: ['dashboard', 'personal_area', 'error', 'root'],
                } as IRouterInitialState,
            };

            const expectedResult = 'dashboard';

            expect(getRouteId(globalState)).toEqual(expectedResult);
        });

        it('without activeIds', () => {
            const globalState = {
                router: {
                    ...initialState,
                    activeIds: null,
                } as IRouterInitialState,
            };

            const expectedResult = null;

            expect(getRouteId(globalState)).toEqual(expectedResult);
        });
    });

    describe('getRoute', () => {
        it('with routeId', () => {
            const routeId = 'dashboard';
            const dashboard: IRouteItem = {
                id: '1',
                exact: true,
            };

            const globalState = {
                router: {
                    ...initialState,
                    routesMap: {
                        dashboard,
                    },
                } as IRouterInitialState,
            };

            const expectedResult = dashboard;

            expect(getRoute(globalState, routeId)).toEqual(expectedResult);
        });

        it('without routeId', () => {
            const dashboard: IRouteItem = {
                id: '1',
                exact: true,
            };

            const globalState = {
                router: {
                    ...initialState,
                    routesMap: {
                        dashboard,
                    },
                    activeIds: ['dashboard'],
                } as IRouterInitialState,
            };

            const expectedResult = dashboard;

            expect(getRoute(globalState)).toEqual(expectedResult);
        });

        it('without routesMap', () => {
            const routeId = 'home';

            const globalState = {
                router: {
                    ...initialState,
                    routesMap: {},
                },
            };

            const expectedResult = null;

            expect(getRoute(globalState, routeId)).toEqual(expectedResult);
        });
    });

    describe('getRouteProp', () => {
        it('with param', () => {
            const exact = true;
            const param = 'exact';
            const routeId = 'dashboard';

            const dashboard: IRouteItem = {
                id: '1',
                exact,
            };

            const globalState = {
                router: {
                    ...initialState,
                    routesMap: {
                        dashboard,
                    },
                } as IRouterInitialState,
            };

            const expectedResult = exact;

            expect(getRouteProp(globalState, routeId, param)).toBe(
                expectedResult,
            );
        });
        it('with not existing param', () => {
            const param = 'exact';
            const routeId = 'dashboard';

            const dashboard: IRouteItem = {
                id: '1',
            };

            const globalState = {
                router: {
                    ...initialState,
                    routesMap: {
                        dashboard,
                    },
                } as IRouterInitialState,
            };

            const expectedResult = null;

            expect(getRouteProp(globalState, routeId, param)).toBe(
                expectedResult,
            );
        });
    });

    describe('getRouteParams', () => {
        it('with params', () => {
            const params = {
                param1: 'param1',
            };

            const globalState = {
                router: {
                    ...initialState,
                    match: {
                        params,
                        path: 'home',
                        isExact: 'true',
                        url: 'https://megasite.com',
                    },
                } as IRouterInitialState,
            };

            const expectedResult = params;

            expect(getRouteParams(globalState)).toEqual(expectedResult);
        });

        it('without params', () => {
            const globalState = {
                router: {
                    ...initialState,
                    match: {
                        params: null,
                        path: 'home',
                        isExact: 'true',
                        url: 'https://megasite.com',
                    },
                } as IRouterInitialState,
            };

            const expectedResult = null;

            expect(getRouteParams(globalState)).toEqual(expectedResult);
        });
    });

    describe('getRouteParam', () => {
        it('with correct param', () => {
            const param = 'param1';
            const params = {
                param1: 'param1',
            };

            const globalState = {
                router: {
                    ...initialState,
                    match: {
                        params,
                        path: 'home',
                        isExact: 'true',
                        url: 'https://megasite.com',
                    },
                } as IRouterInitialState,
            };

            const expectedResult = params.param1;

            expect(getRouteParam(globalState, param)).toBe(expectedResult);
        });

        it('with incorrect param', () => {
            const param = 'param2';

            const globalState = {
                router: {
                    ...initialState,
                    match: {
                        params: {
                            param1: 'param1',
                        },
                        path: 'home',
                        isExact: 'true',
                        url: 'https://megasite.com',
                    },
                } as IRouterInitialState,
            };

            const expectedResult = null;

            expect(getRouteParam(globalState, param)).toBe(expectedResult);
        });
    });

    //TODO getRouteBreadcrumbs

    describe('getRouteChildren', () => {
        it('with items', () => {
            const routeId = 'dashboard';
            const items = [{id: '1', exact: true}];

            const globalState = {
                router: {
                    ...initialState,
                    routesMap: {
                        dashboard: {
                            id: '1',
                            exact: true,
                            items,
                        },
                    },
                } as IRouterInitialState,
            };

            const expectedResult = items;

            expect(getRouteChildren(globalState, routeId)).toEqual(
                expectedResult,
            );
        });

        it('without items', () => {
            const routeId = 'dashboard';

            const globalState = {
                router: {
                    ...initialState,
                    routesMap: {
                        dashboard: {
                            id: '1',
                            exact: true,
                        },
                    },
                } as IRouterInitialState,
            };

            const expectedResult = null;

            expect(getRouteChildren(globalState, routeId)).toEqual(
                expectedResult,
            );
        });
    });

    //TODO getRouteParent
});
