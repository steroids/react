import {
    IRouterInitialState,
    isRouterInitialized,
    buildUrl,
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

    //  describe('checkIsActive', () => {
    //      it('not SSR with file protocol', () => {
    //          process.env.IS_SSR = 'false';

    //          global.window.location.protocol = 'file:';
    //          global.window.location.href = '#yakor';

    //          const item = {
    //              exact: true,
    //              strict: false,
    //              path: '...s',
    //          };
    //      });

    //      it('not SSR without file protocol', () => {
    //          process.env.IS_SSR = 'false';
    //          global.window.location.protocol = 'http:';
    //      });
    //  });

    //TODO normalizeRoutes findRecursive

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
