import {IRouterInitialState} from '../../../src/reducers/router';
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

    //TODO ROUTER_INIT_ROUTES @@router/LOCATION_CHANGE ROUTER_SET_PARAMS
});
