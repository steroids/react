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

    it('seeds router.location from a memory history with a forced "?" search in SSR mode', () => {
        process.env.IS_SSR = 'true';

        const store = new StoreComponent({} as any, {
            reducers,
        } as any);
        const state = store.getState();

        expect(state.router.location).toEqual(
            expect.objectContaining({
                pathname: '/',
                search: '?',
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
