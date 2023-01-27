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

    it('ROUTER_INIT_ROUTES', () => {
        const parentRouteId = '1';

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
            currentId: null,
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
            const action = {
                type: '@@router/LOCATION_CHANGE',
            };

            global.window.location.protocol = 'http:';

            const parentRoute: IRouteItem = {
                id: '1',
                isNavVisible: true,
                isVisible: true,
                path: '/parentRoute',
                exact: true,
                strict: false,

                items: [
                    {
                        id: '2',
                        isNavVisible: true,
                        isVisible: true,
                        path: 'parentRoute/childrenRoute',
                        exact: true,
                        strict: false,
                    },
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
                    1: parentRoute,
                    2: parentRoute.items && parentRoute.items[0],
                },
                activeIds: ['4', '5'],
            };

            const expectedState: IRouterInitialState = {
                ...initialState,
                activeIds: [],
                currentId: null,
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
                activeIds: ['4', '5'],
            };

            const expectedState: IRouterInitialState = {
                ...initialState,
                activeIds: [],
                currentId: null,
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
