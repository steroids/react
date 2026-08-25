import {AUTH_INIT} from '../../src/actions/auth';
import StoreComponent from '../../src/components/StoreComponent';
import reducers from '../../src/reducers/index';

describe('StoreComponent router state on construction', () => {
    const originalEnv = process.env;
    const originalProtocol = global.window.location.protocol;

    beforeEach(() => {
        process.env = {
            ...originalEnv,
        };
        global.window.location.protocol = originalProtocol;
    });

    afterEach(() => {
        process.env = originalEnv;
        global.window.location.protocol = originalProtocol;
    });

    it('seeds router.location from a browser history on construction', () => {
        global.window.location.protocol = 'http:';

        const store = new StoreComponent({} as any, {
            reducers,
        } as any);
        const state = store.getState();

        expect(state.router.location).toEqual(
            expect.objectContaining({
                pathname: '/',
                search: '',
                query: {},
            }),
        );
        expect(state.router.action).toBe('POP');
        expect(state.router.routesTree).toBeUndefined();
        expect(state.router.match).toBeUndefined();
    });

    it('seeds router.location from a memory history in SSR mode', () => {
        process.env.IS_SSR = 'true';

        const store = new StoreComponent({} as any, {
            reducers,
        } as any);
        const state = store.getState();

        expect(state.router.location).toEqual(
            expect.objectContaining({
                pathname: '/',
                search: '',
                query: {},
            }),
        );
    });

    it('seeds router.location from a hash history when location.protocol is "file:"', () => {
        global.window.location.protocol = 'file:';

        const store = new StoreComponent({} as any, {
            reducers,
        } as any);
        const state = store.getState();

        expect(state.router.location.pathname).toBe('/');
        expect(state.history?.hashType ?? undefined).toBeUndefined();
    });

    it('fully populates router.routesTree/match once ROUTER_INIT_ROUTES is dispatched', () => {
        global.window.location.protocol = 'http:';

        const store = new StoreComponent({} as any, {
            reducers,
        } as any);
        const route = {
            id: 'root',
            path: '/',
            exact: true,
        };

        store.dispatch({
            type: 'ROUTER_INIT_ROUTES',
            routes: route,
        });

        const state = store.getState();

        expect(state.router.routesTree).toBeDefined();
        expect(state.router.routesMap).toEqual(
            expect.objectContaining({
                root: expect.objectContaining({
                    id: 'root',
                }),
            }),
        );
    });
});

describe('StoreComponent _prepare middleware', () => {
    const originalProtocol = global.window.location.protocol;

    beforeEach(() => {
        global.window.location.protocol = 'http:';
    });

    afterEach(() => {
        global.window.location.protocol = originalProtocol;
    });

    it('dispatches a plain object action to the reducers', () => {
        const store = new StoreComponent({} as any, {
            reducers,
        } as any);

        store.dispatch({
            type: AUTH_INIT,
        });

        expect(store.getState().auth.initializeCounter).toBe(1);
        expect(store.lastAction).toBe(AUTH_INIT);
    });

    it('dispatches every truthy action in an array (redux-multi) and filters out falsy entries', () => {
        const store = new StoreComponent({} as any, {
            reducers,
        } as any);

        store.dispatch([
            {
                type: AUTH_INIT,
            },
            null,
            undefined,
            false,
            {
                type: AUTH_INIT,
            },
        ]);

        expect(store.getState().auth.initializeCounter).toBe(2);
    });

    it('invokes a function action with (dispatch, getState, components) and lets it dispatch further actions (redux-thunk)', () => {
        const components = {
            some: 'components',
        };
        const store = new StoreComponent(components as any, {
            reducers,
        } as any);

        const thunk = jest.fn((dispatch, getState, thunkComponents) => {
            dispatch({
                type: AUTH_INIT,
            });
            return {
                stateSeenInsideThunk: getState().auth.initializeCounter,
                componentsSeenInsideThunk: thunkComponents,
            };
        });

        const result = store.dispatch(thunk);

        expect(thunk).toHaveBeenCalled();
        expect(result.stateSeenInsideThunk).toBe(1);
        expect(result.componentsSeenInsideThunk).toBe(components);
        expect(store.getState().auth.initializeCounter).toBe(1);
    });

    it('dispatches the resolved action once a promise action resolves', async () => {
        const store = new StoreComponent({} as any, {
            reducers,
        } as any);

        await store.dispatch(Promise.resolve({
            type: AUTH_INIT,
        }));

        expect(store.getState().auth.initializeCounter).toBe(1);
    });

    it('routes a rejected promise action to errorHandler instead of throwing', async () => {
        const store = new StoreComponent({} as any, {
            reducers,
        } as any);
        const error = new Error('boom');
        store.errorHandler = jest.fn();

        await store.dispatch(Promise.reject(error));

        expect(store.errorHandler).toHaveBeenCalledWith(error, expect.any(Function));
    });
});
