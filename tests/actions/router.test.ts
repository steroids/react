import configureMockStore from 'redux-mock-store';

import {
    ROUTER_INIT_ROUTES,
    ROUTER_SET_PARAMS,
    goToParent,
    goToRoute,
    initParams,
    initRoutes,
} from '../../src/actions/router';
import prepareMiddleware from '../mocks/storeMiddlewareMock';

const mockStore = configureMockStore([prepareMiddleware]);
const store = mockStore({});

describe('actions router', () => {
    beforeEach(() => {
        store.clearActions();
    });

    it('initRoutes', () => {
        const routes = {
            home: '/home',
            contacts: '/contacts',
        };

        const expectedActions = [
            {
                type: ROUTER_INIT_ROUTES,
                routes,
            },
        ];

        store.dispatch(initRoutes(routes));

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('initParams', () => {
        const params = {
            shallow: true,
            displayUrl: false,
        };

        const expectedActions = [
            {
                type: ROUTER_SET_PARAMS,
                params,
            },
        ];

        store.dispatch(initParams(params));

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('goToParent without parentRouteId', () => {
        const level = 2;
        const expectedActions = [];

        store.dispatch(goToParent(level));

        expect(store.getActions()).toEqual(expectedActions);
    });
});

describe('goToRoute', () => {
    let mockedStore;

    const routeId = 'route1';
    const path = '/some-route';
    const type = '@@router/CALL_HISTORY_METHOD';

    const pushPayload = {
        method: 'push',
        args: [path],
    };

    const replacePayload = {
        method: 'replace',
        args: [path],
    };

    beforeEach(() => {
        store.clearActions();

        mockedStore = mockStore({
            router: {
                routesMap: {
                    [routeId]: {
                        path,
                    },
                },
            },
        });
    });

    it('without arguments', () => {
        const expectedActions = [
            {
                type,
                payload: pushPayload,
            },
        ];

        mockedStore.dispatch(goToRoute(routeId));
        expect(mockedStore.getActions()).toEqual(expectedActions);
    });

    it('with params', () => {
        const expectedActions = [
            {
                type,
                payload: pushPayload,
            },
        ];

        const params = {
            exact: false,
            query: 'contacts',
        };
        const isReplace = false;

        mockedStore.dispatch(goToRoute(routeId, params, isReplace));
        expect(mockedStore.getActions()).toEqual(expectedActions);
    });

    it('with replace', () => {
        const expectedActions = [
            {
                type,
                payload: replacePayload,
            },
        ];

        const params = null;
        const isReplace = true;

        mockedStore.dispatch(goToRoute(routeId, params, isReplace));
        expect(mockedStore.getActions()).toEqual(expectedActions);
    });

    it('with params and replace', () => {
        const expectedActions = [
            {
                type,
                payload: replacePayload,
            },
        ];

        const params = {
            exact: false,
            query: 'contacts',
        };
        const isReplace = true;

        mockedStore.dispatch(goToRoute(routeId, params, isReplace));
        expect(mockedStore.getActions()).toEqual(expectedActions);
    });
});
