import {
    IRouterInitialState,
    isRouterInitialized,
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

    beforeEach(() => {
        initialState = {...defaultInitialState};
        jest.resetModules();

        process.env = {
            ...originalEnv,
        };
    });

    describe('buildUrl', () => {
        it('with params', () => {
            const path = '/home/contacts/physics';

            const params = {
                search: 'Ivan',
            };

            const expectedUrl = '/home/contacts/physics?search=Ivan';
            expect(buildUrl(path, params)).toBe(expectedUrl);
        });

        it('without params', () => {
            const path = '/home/contacts/physics';
            const params = null;
            expect(buildUrl(path, params)).toBe(path);
        });
    });

    describe('checkIsActive', () => {
        //TODO checkIsActive with file protocol
        //   it('not SSR with file protocol', () => {
        //       process.env.IS_SSR = 'false';
        //       global.window.location.protocol = 'file:';
        //       global.window.location.hash = 'hash';

        //       const item = {
        //           path: 'contacts/hash',
        //           exact: false,
        //           strict: false,
        //       };

        //       const state: IRouterInitialState = {
        //           ...initialState,
        //           location: null,
        //       };

        //       console.log(checkIsActive(state, item));
        //   });

        it('not SSR without file protocol', () => {
            const pathname = 'home/contacts/it';

            const item = {
                exact: true,
                strict: true,
                path: pathname,
            };

            global.window.location.protocol = 'http:';

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
        it('without items', () => {
            const component = () => null;

            const routesMap: {[key: string]: IRouteItem} = {
                dashboard: {
                    id: '1',
                    component,
                },
                information: {
                    id: '2',
                    component,
                },
            };

            const state: IRouterInitialState = {
                ...initialState,
                routesMap,
            };

            const item: IRouteItem = {
                id: '5',
                title: 'megaItem',
                label: 'megaLabel',
                exact: true,
                strict: true,
                path: 'home/contacts/mega',
                isVisible: true,
                isNavVisible: true,
                component,
                componentProps: null,
            };

            const activeIds = ['dashboard', 'information'];

            const expectedRoutesTree = {
                ...item,
                id: item.id,
                title: item.title,
                label: item.label,
                exact: item.exact,
                strict: item.strict,
                path: item.path,
                isVisible: item.isVisible,
                isNavVisible: item.isNavVisible,
                component: null,
                componentProps: item.componentProps,
                icon: null,
                roles: [],
                items: null,
            };

            expect(normalizeRoutes(state, item, activeIds, routesMap)).toEqual(
                expectedRoutesTree,
            );
        });

        it('with items as object', () => {
            const component = () => null;
            const childrenPage = 'memePage';
            const activeIds = ['dashboard', 'information'];

            const items = {
                [childrenPage]: {
                    id: '3',
                    exact: true,
                } as IRouteItem,
            };

            const routesMap: {[key: string]: IRouteItem} = {
                dashboard: {
                    id: '1',
                    component,
                },
                information: {
                    id: '2',
                    component,
                },
            };

            const state: IRouterInitialState = {
                ...initialState,
                routesMap,
            };

            const item: IRouteItem = {
                id: '5',
                title: 'megaItem',
                label: 'megaLabel',
                exact: true,
                strict: true,
                path: 'home/contacts/mega',
                isVisible: true,
                isNavVisible: true,
                component,
                componentProps: null,
                items,
            };

            const expectedRoutesTree = {
                ...item,
                id: item.id,
                title: item.title,
                label: item.label,
                exact: item.exact,
                strict: item.strict,
                path: item.path,
                isVisible: item.isVisible,
                isNavVisible: item.isNavVisible,
                component: null,
                componentProps: item.componentProps,
                icon: null,
                roles: [],
                items: [
                    {
                        ...normalizeRoutes(
                            state,
                            items.memePage,
                            activeIds,
                            routesMap,
                        ),
                        id: childrenPage,
                    },
                ],
            };

            expect(normalizeRoutes(state, item, activeIds, routesMap)).toEqual(
                expectedRoutesTree,
            );
        });

        it('with items as array', () => {
            const component = () => null;

            const items = [{id: '3', exact: true} as IRouteItem];

            const routesMap: {[key: string]: IRouteItem} = {
                dashboard: {
                    id: '1',
                    component,
                },
                information: {
                    id: '2',
                    component,
                },
            };

            const state: IRouterInitialState = {
                ...initialState,
                routesMap,
            };

            const item: IRouteItem = {
                id: '5',
                title: 'megaItem',
                label: 'megaLabel',
                exact: true,
                strict: true,
                path: 'home/contacts/mega',
                isVisible: true,
                isNavVisible: true,
                component,
                componentProps: null,
                items,
            };

            const activeIds = ['dashboard', 'information'];

            const expectedRoutesTree = {
                ...item,
                id: item.id,
                title: item.title,
                label: item.label,
                exact: item.exact,
                strict: item.strict,
                path: item.path,
                isVisible: item.isVisible,
                isNavVisible: item.isNavVisible,
                component: null,
                componentProps: item.componentProps,
                icon: null,
                roles: [],
                items: [
                    {
                        ...normalizeRoutes(
                            state,
                            items[0],
                            activeIds,
                            routesMap,
                        ),
                    },
                ],
            };

            expect(normalizeRoutes(state, item, activeIds, routesMap)).toEqual(
                expectedRoutesTree,
            );
        });
    });

    describe('findRecursive', () => {
        it('with predicate as parentRoute id', () => {
            const parentRouteId = '1';

            const parentRoute: IRouteItem = {
                id: parentRouteId,
                label: 'parentRoute',
            };

            const pathItems: IRouteItem[] = [
                {id: '2', label: 'item2'},
                {id: '3', label: 'item3'},
            ];

            const expectedPathItems = pathItems.concat([parentRoute]);

            expect(
                findRecursive(parentRoute, parentRouteId, pathItems),
            ).toEqual(parentRoute);

            expect(pathItems).toEqual(expectedPathItems);
        });

        it('with predicate as parentRoute id, without pathItems', () => {
            const parentRouteId = '1';

            const parentRoute: IRouteItem = {
                id: parentRouteId,
                label: 'parentRoute',
            };

            expect(findRecursive(parentRoute, parentRouteId)).toEqual(
                parentRoute,
            );
        });

        it('without predicate and childrenRoutes array', () => {
            const predicate = '';

            const parentRoute: IRouteItem = {
                id: '1',
                label: 'parentRoute',
            };

            const emptyRoute = null;

            expect(findRecursive(parentRoute, predicate)).toEqual(emptyRoute);
        });

        it('with childrenRoutes array and pathItems', () => {
            const routeId = '1';
            const deepRouteId = '10';

            const deepChildrenRoute = {
                id: deepRouteId,
                label: 'item10',
            };

            const childrenRoutes: IRouteItem[] = [
                {
                    id: '2',
                    label: 'children2',
                    items: [deepChildrenRoute],
                },
            ];

            const parentRoute: IRouteItem = {
                id: routeId,
                label: 'parentRoute',
                items: childrenRoutes,
            };

            const pathItems: IRouteItem[] = [
                {id: '2', label: 'item2'},
                {id: '3', label: 'item3'},
            ];

            const expectedPathItems = pathItems
                .concat([deepChildrenRoute])
                .concat([childrenRoutes[0]])
                .concat([parentRoute]);

            const expectedRoute = childrenRoutes[0];

            expect(findRecursive(parentRoute, deepRouteId, pathItems)).toEqual(
                expectedRoute,
            );

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
                id: 'route1',
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

    describe('isRouterInitialized', () => {
        it('without routesTree', () => {
            const globalState = {
                router: {
                    ...initialState,
                    routesTree: null,
                } as IRouterInitialState,
            };

            const expectedIsInitialized = false;

            expect(isRouterInitialized(globalState)).toBe(
                expectedIsInitialized,
            );
        });

        it('with routesTree', () => {
            const globalState = {
                router: {
                    ...initialState,
                    routesTree: {},
                } as IRouterInitialState,
            };

            const expectedIsInitialized = true;

            expect(isRouterInitialized(globalState)).toBe(
                expectedIsInitialized,
            );
        });
    });

    afterEach(() => {
        process.env = originalEnv;
    });
});
