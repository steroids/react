import {combineReducers} from 'redux';
import auth from './auth';
import fields from './fields';
import form from './form';
import list from './list';
import notifications from './notifications';
import modal from './modal';
import router from './router';
import screen from './screen';

export {
    form, auth, fields, list, notifications, modal, router, screen,
};
export default asyncReducers => combineReducers({
    form,
    auth,
    fields,
    list,
    notifications,
    modal,
    screen,
    ...asyncReducers,
    router: (state, action) => router(asyncReducers.router(state, action), action),
});
