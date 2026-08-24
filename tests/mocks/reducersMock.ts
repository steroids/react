import {matchLocationChangeAction} from '@lagunovsky/redux-react-router';
import * as queryString from 'qs';
import {combineReducers} from 'redux';

import auth from '../../src/reducers/auth';
import fields from '../../src/reducers/fields';
import form from '../../src/reducers/form';
import list from '../../src/reducers/list';
import modal from '../../src/reducers/modal';
import notifications from '../../src/reducers/notifications';
import router from '../../src/reducers/router';
import kanban from '../../src/ui/content/Kanban/reducers';

export {
    form, auth, fields, list, notifications, modal, router, kanban,
};

// Mirrors the composition fix in src/reducers/index.ts (see there for why it's needed)
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
    kanban,
    ...asyncReducers,
    router: (state, action) => {
        if (!asyncReducers.router) {
            return router(state, action);
        }

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
