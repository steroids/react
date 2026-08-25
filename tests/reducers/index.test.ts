import {createRouterReducer, onLocationChanged} from '@lagunovsky/redux-react-router';
import {createMemoryHistory} from 'history';
import {createStore} from 'redux';

import {ROUTER_INIT_ROUTES} from '../../src/actions/router';
import createRootReducer from '../../src/reducers/index';

describe('root reducer composition (reducers/index.ts)', () => {
    it('combines all reducers into the expected state shape', () => {
        const rootReducer = createRootReducer({});
        const store: any = createStore(rootReducer as any);

        expect(Object.keys(store.getState()).sort()).toEqual(
            ['form', 'auth', 'fields', 'list', 'notifications', 'modal', 'router'].sort(),
        );
    });

    it('falls back to the plain router reducer when no async router reducer is supplied', () => {
        const rootReducer = createRootReducer({});
        const store: any = createStore(rootReducer as any);

        expect(store.getState().router).toEqual(
            expect.objectContaining({
                location: null,
                routesTree: null,
            }),
        );
    });

    it('preserves unrelated router substate (routesTree/routesMap/match) across a location change', () => {
        const history = createMemoryHistory();
        const routerReducer = createRouterReducer(history);
        const rootReducer = createRootReducer({
            router: routerReducer,
        });
        const store: any = createStore(rootReducer as any);

        const route = {
            id: 'root',
            path: '/',
            exact: true,
        };

        store.dispatch({
            type: ROUTER_INIT_ROUTES,
            routes: route,
        });

        expect(store.getState().router.routesTree).toBeDefined();
        expect(store.getState().router.routesMap).toEqual(
            expect.objectContaining({
                root: expect.objectContaining({
                    id: 'root',
                }),
            }),
        );

        // createRouterReducer() returns action.payload as-is on location change, without
        // merging the incoming state - reducers/index.ts is responsible for preserving
        // routesTree/routesMap/match across this action, see the comment there.
        store.dispatch(onLocationChanged({
            ...history.location,
            pathname: '/next',
        }, 'PUSH' as any));

        const state = store.getState();

        expect(state.router.location.pathname).toBe('/next');
        expect(state.router.routesTree).toBeDefined();
        expect(state.router.routesMap).toEqual(
            expect.objectContaining({
                root: expect.objectContaining({
                    id: 'root',
                }),
            }),
        );
    });

    it('injects a parsed "query" into router.location on a location change, mirroring connected-react-router', () => {
        const history = createMemoryHistory();
        const routerReducer = createRouterReducer(history);
        const rootReducer = createRootReducer({
            router: routerReducer,
        });
        const store: any = createStore(rootReducer as any);

        // ROUTER_ON_LOCATION_CHANGED assumes routesMap is already populated (see reducers/router.ts),
        // matching real app flow where ROUTER_INIT_ROUTES always fires before any navigation.
        store.dispatch({
            type: ROUTER_INIT_ROUTES,
            routes: {
                id: 'root',
                path: '/',
                exact: true,
            },
        });

        store.dispatch(onLocationChanged({
            ...history.location,
            pathname: '/next',
            search: '?foo=bar',
        }, 'PUSH' as any));

        expect(store.getState().router.location.query).toEqual({
            foo: 'bar',
        });
    });
});
