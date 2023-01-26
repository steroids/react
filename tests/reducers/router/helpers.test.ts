import {
    IRouterInitialState,
    isRouterInitialized,
    buildUrl,
    checkIsActive,
    normalizeRoutes,
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
        //TODO checkIsActive
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

    //TODO normalizeRoutes findRecursive

    describe('normalizeRoutes', () => {
        it('with items as object', () => {
            const component = () => null;

            const items = {
                memePage: {id: '3', component},
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
            };
            const activeIds = ['dashboard', 'information'];

            const expectedResult = {
                ...item,
                id: item.id,
                title: item.title,
                label: item.label,
                icon: null,
                exact: item.exact,
                strict: item.strict,
                path: item.path,
                isVisible: item.isVisible,
                isNavVisible: item.isNavVisible,
                component: item.component,
                componentProps: item.componentProps,
                roles: [],
            };

            expect(normalizeRoutes(state, item, activeIds, routesMap));
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
