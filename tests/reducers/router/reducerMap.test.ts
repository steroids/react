import {
    ROUTER_INIT_ROUTES,
    ROUTER_SET_PARAMS,
} from '../../../src/actions/router';
import router, {IRouterInitialState} from '../../../src/reducers/router';
import {IRouteItem} from '../../../src/ui/nav/Router/Router';

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
    });

    it('ROUTER_INIT_ROUTES', () => {
        const parentRouteId = 'parentRouteId';

        const parentRoute: IRouteItem = {
            id: parentRouteId,
            isNavVisible: true,
            isVisible: true,
            items: [],
            title: 'parentRoute',
            label: 'parentRoute',
            icon: null,
            exact: false,
            strict: false,
            path: '',
            component: null,
            componentProps: null,
            roles: [],
        };

        const action = {
            type: ROUTER_INIT_ROUTES,
            routes: parentRoute,
        };

        const expectedState = {
            location: null,
            routesTree: parentRoute,
            routesMap: {
                [parentRouteId]: parentRoute,
            },
            activeIds: [],
            match: null,
            params: {},
            configs: [],
            data: {},
            counters: {},
        };

        expect(router(initialState, action)).toEqual(expectedState);
    });

    describe('@@router/LOCATION_CHANGE', () => {
        it('with routesMap', () => {
            const parentRouteId = 'parentRouteId';
            const childRouteId = 'childRouteId';

            const action = {
                type: '@@router/LOCATION_CHANGE',
            };

            global.window.location.protocol = 'http:';

            const childRoute = {
                id: 'childRouteId',
                isNavVisible: true,
                isVisible: true,
                path: 'parentRoute/childrenRoute',
                exact: true,
                strict: false,
            };

            const parentRoute: IRouteItem = {
                id: 'parentRouteId',
                isNavVisible: true,
                isVisible: true,
                path: '/parentRoute',
                exact: true,
                strict: false,
                items: [
                    childRoute
                ],
            };

            initialState = {
                ...defaultInitialState,
                location: {
                    pathname: '/parentRoute/childrenRoute',
                    hash: '',
                    query: {},
                    search: '',
                },
                routesMap: {
                    [parentRouteId]: parentRoute,
                    [childRouteId]: childRoute,
                },
                activeIds: ['someRoute1', 'someRoute2'],
            };

            const expectedState: IRouterInitialState = {
                ...initialState,
                activeIds: [],
                match: null,
                params: {},
                configs: [],
                data: {},
                counters: {},
                routesTree: null,
            };

            expect(router(initialState, action)).toEqual(expectedState);
        });

        it('without routesMap', () => {
            const action = {
                type: '@@router/LOCATION_CHANGE',
            };

            global.window.location.protocol = 'http:';

            initialState = {
                ...defaultInitialState,
                location: {
                    pathname: '/parentRoute/childrenRoute',
                    hash: '',
                    query: {},
                    search: '',
                },
                routesMap: {},
                activeIds: ['someRoute1', 'someRoute2'],
            };

            const expectedState: IRouterInitialState = {
                ...initialState,
                activeIds: [],

                match: null,
                params: {},
                configs: [],
                data: {},
                counters: {},
                routesTree: null,
            };

            expect(router(initialState, action)).toEqual(expectedState);
        });
    });

    it('ROUTER_SET_PARAMS', () => {
        const action = {
            type: ROUTER_SET_PARAMS,
            params: {
                someParam: true,
            },
        };

        initialState = {
            ...defaultInitialState,
            location: {
                hash: '',
                pathname: '',
                search: '',
                query: {
                    megaQuery: 'megaValue',
                },
            },
        };

        const expectedState = {
            ...initialState,
            params: {
                ...action.params,
                ...initialState.location?.query,
            },
        };

        expect(router(initialState, action)).toEqual(expectedState);
    });
});
