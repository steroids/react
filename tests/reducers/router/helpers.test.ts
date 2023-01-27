import {
    IRouterInitialState,
    isRouterInitialized,
    buildUrl,
    checkIsActive,
    normalizeRoutes,
    findRecursive,
} from '../../../src/reducers/router';
import {IRouteItem} from '../../../src/ui/nav/Router/Router';

const originalEnv = process.env;

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

            const expectedResult = '/home/contacts/physics?search=Ivan';

            expect(buildUrl(path, params)).toBe(expectedResult);
        });

        it('without params', () => {
            const path = '/home/contacts/physics';
            const params = null;

            const expectedResult = path;

            expect(buildUrl(path, params)).toBe(expectedResult);
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

            const expectedResult = true;

            expect(checkIsActive(state, item)).toBe(expectedResult);
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

            const expectedResult = {
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
                expectedResult,
            );
        });

        it('with items as object', () => {
            const component = () => null;
            const childrenPage = 'memePage';

            const items = {
                [childrenPage]: {id: '3', exact: true} as IRouteItem,
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
            const activeIds = ['dashboard', 'information'];

            const expectedResult = {
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
                expectedResult,
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

            const expectedResult = {
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
                expectedResult,
            );
        });
    });

    describe('findRecursive', () => {
        it('with predicate as parentRoute id', () => {
            const parentRouteId = '1';

            const predicate = parentRouteId;

            const parentRoute: IRouteItem = {
                id: parentRouteId,
                label: 'parentRoute',
            };

            const pathItems: IRouteItem[] = [
                {id: '2', label: 'item2'},
                {id: '3', label: 'item3'},
            ];

            const expectedResult = parentRoute;
            const expectedPathItems = pathItems.concat([parentRoute]);

            expect(findRecursive(parentRoute, predicate, pathItems)).toEqual(
                expectedResult,
            );
            expect(pathItems).toEqual(expectedPathItems);
        });

        it('with predicate as parentRoute id, without pathItems', () => {
            const parentRouteId = '1';

            const predicate = parentRouteId;

            const parentRoute: IRouteItem = {
                id: parentRouteId,
                label: 'parentRoute',
            };

            const expectedResult = parentRoute;

            expect(findRecursive(parentRoute, predicate)).toEqual(
                expectedResult,
            );
        });

        it('without predicate and childrenRoutes array', () => {
            const parentRouteId = '1';

            const predicate = '';

            const parentRoute: IRouteItem = {
                id: parentRouteId,
                label: 'parentRoute',
            };

            const expectedResult = null;

            expect(findRecursive(parentRoute, predicate)).toEqual(
                expectedResult,
            );
        });

        it('with childrenRoutes array and pathItems', () => {
            const routeId = '1';
            const predicate = '10';
            const deepChildrenRoute = {
                id: '10',
                label: 'item10',
            };

            const childrenRoutes: IRouteItem[] = [
                {
                    id: '2',
                    label: 'children2',
                    items: [
                        {
                            ...deepChildrenRoute,
                        },
                    ] as IRouteItem[],
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

            const expectedResult = childrenRoutes[0];

            expect(findRecursive(parentRoute, predicate, pathItems)).toEqual(
                expectedResult,
            );
            expect(pathItems).toEqual(expectedPathItems);
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

            const expectedResult = false;

            expect(isRouterInitialized(globalState)).toBe(expectedResult);
        });

        it('with routesTree', () => {
            const globalState = {
                router: {
                    ...initialState,
                    routesTree: {},
                } as IRouterInitialState,
            };

            const expectedResult = true;

            expect(isRouterInitialized(globalState)).toBe(expectedResult);
        });
    });

    afterEach(() => {
        process.env = originalEnv;
    });
});
