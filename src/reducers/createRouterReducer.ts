import {matchLocationChangeAction, ReduxRouterState} from '@lagunovsky/redux-react-router';
import * as queryString from 'qs';
import {Reducer, AnyAction} from 'redux';

import {IRouterInitialState} from './router';

/**
 * Adds a parsed 'query' object to the location, derived from its 'search' string,
 * so consumers don't have to parse the query string themselves.
 */
const injectQuery = (location: IRouterInitialState['location']) => {
    if (!location || location.query) {
        return location;
    }

    const search = typeof location.search === 'string' ? location.search : '';
    return {
        ...location,
        query: queryString.parse(search.replace(/^\?/, '')),
    };
};

/**
 * Wraps the base router reducer with the async 'router' reducer registered via
 * asyncReducers (createRouterReducer() from @lagunovsky/redux-react-router), merging
 * their state and injecting a parsed 'query' into the resulting location.
 */
export default (
    router: Reducer<IRouterInitialState, AnyAction>,
    asyncRouterReducer: Reducer<ReduxRouterState, AnyAction> | undefined,
) => (state: IRouterInitialState, action: AnyAction): IRouterInitialState => {
    if (!asyncRouterReducer) {
        return router(state, action);
    }

    const routerSubState = asyncRouterReducer(state as unknown as ReduxRouterState, action);
    const normalizedRouterSubState = {
        ...routerSubState,
        location: injectQuery(routerSubState.location as unknown as IRouterInitialState['location']),
    };

    // On a location change, asyncRouterReducer() (createRouterReducer() from
    // @lagunovsky/redux-react-router) returns action.payload as routerSubState as-is, without
    // the fields it doesn't know about (routesTree, activeIds, match, params...) - merge them
    // back in from the previous state here.
    const mergedState = matchLocationChangeAction(action)
        ? {
            ...state,
            ...normalizedRouterSubState,
        }
        : normalizedRouterSubState;

    return router(mergedState as unknown as IRouterInitialState, action);
};
