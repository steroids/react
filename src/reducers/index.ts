import {matchLocationChangeAction} from '@lagunovsky/redux-react-router';
import * as queryString from 'qs';
import {combineReducers} from 'redux';

import auth from './auth';
import fields from './fields';
import form from './form';
import list from './list';
import modal from './modal';
import notifications from './notifications';
import router from './router';

export {
    form, auth, fields, list, notifications, modal, router,
};

// Add 'query' to location, mirroring what connected-react-router used to inject for us
const injectQuery = location => {
    if (!location || location.query) {
        return location;
    }

    const search = typeof location.search === 'string' ? location.search : '';
    return {
        ...location,
        query: queryString.parse(search.replace(/^\?/, '')),
    };
};

export default asyncReducers => combineReducers({
    form,
    auth,
    fields,
    list,
    notifications,
    modal,
    ...asyncReducers,
    router: (state, action) => {
        if (!asyncReducers.router) {
            return router(state, action);
        }

        // createRouterReducer() returns action.payload as-is on location change, without
        // merging the incoming state - unlike the previous router reducer, it does not
        // preserve unrelated fields (routesTree, activeIds, match, params...) by itself
        const routerSubState = asyncReducers.router(state, action);
        const normalizedRouterSubState = {
            ...routerSubState,
            location: injectQuery(routerSubState.location),
        };
        const mergedState = matchLocationChangeAction(action)
            ? {
                ...state,
                ...normalizedRouterSubState,
            }
            : normalizedRouterSubState;

        return router(mergedState, action);
    },
});
