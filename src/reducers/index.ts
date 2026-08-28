import {combineReducers} from 'redux';

import auth from './auth';
import createRouterReducer from './createRouterReducer';
import fields from './fields';
import form from './form';
import list from './list';
import modal from './modal';
import notifications from './notifications';
import router from './router';

export {
    form, auth, fields, list, notifications, modal, router,
};

export default asyncReducers => combineReducers({
    form,
    auth,
    fields,
    list,
    notifications,
    modal,
    ...asyncReducers,
    router: createRouterReducer(router, asyncReducers.router),
});
