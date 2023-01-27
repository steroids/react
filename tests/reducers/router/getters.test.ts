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

    beforeEach(() => {
        initialState = {...defaultInitialState};
    });
    describe('getMatch', () => {
        it('without currentRoute', () => {
            const currentRoute = null;

            const state: IRouterInitialState = {
                ...initialState,
            };

            const expectedResult = null;

            expect(getMatch(currentRoute, state)).toBe(expectedResult);
        });

        it('with currentRoute', () => {
            const path = '/home/contacts';

            const currentRoute = {
                id: 1,
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

            const expectedResult = {
                path,
                url: path,
                isExact: true,
                params: {
                    ...state.location?.query,
                },
            };

            expect(getMatch(currentRoute, state)).toEqual(expectedResult);
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

    it('getRouteBreadcrumbs', () => {
        const predicate = '2';

        const childrenRoutes: IRouteItem[] = [
            {
                id: '2',
                label: 'childrenRoute1',
                isVisible: true,
                isNavVisible: true,
                items: [],
            },
        ];

        const parentRoute: IRouteItem = {
            id: '1',
            label: 'parentRoute',
            isVisible: true,
            isNavVisible: true,
            items: childrenRoutes,
        };

        const globalState = {
            router: {
                ...initialState,
                routesTree: parentRoute,
            } as IRouterInitialState,
        };

        const expectedResult = [parentRoute, childrenRoutes[0]];

        expect(getRouteBreadcrumbs(globalState, predicate)).toEqual(
            expectedResult,
        );
    });

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

    describe('getRouteParent', () => {
        const routeId = '3';
        const parentRoute: IRouteItem = {
            id: 'parentRoute',
            isNavVisible: true,
            isVisible: true,
            items: [
                {
                    id: '2',
                    label: 'desired route',
                    isNavVisible: true,
                    isVisible: true,
                    items: [
                        {
                            id: '3',
                            isNavVisible: true,
                            isVisible: true,
                            items: [],
                        },
                    ],
                },
            ],
        };

        const globalState = {
            router: {
                ...initialState,
                routesMap: {
                    1: parentRoute,
                    2: parentRoute.items ? parentRoute.items[0] : {},
                    3: parentRoute.items ? parentRoute.items[0].items[0] : {},
                },
                routesTree: parentRoute,
            } as IRouterInitialState,
        };

        it('with correct level', () => {
            const level = 1;

            const expectedResult = parentRoute.items && parentRoute.items[0];

            expect(getRouteParent(globalState, routeId, level)).toEqual(
                expectedResult,
            );
        });

        it('with incorrect level', () => {
            const level = 2;
            const expectedResult = null;

            expect(getRouteParent(globalState, routeId, level)).toBe(
                expectedResult,
            );
        });
    });
});
