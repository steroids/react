import {combineReducers} from 'redux';
import auth from './auth';
import fields from './fields';
import form from './form';
import list from './list';
import notifications from './notifications';
import modal from './modal';
import router from './router';
import kanban from '../ui/content/Kanban/reducer';

export {
    form, auth, fields, list, notifications, modal, router, kanban,
};
export default asyncReducers => combineReducers({
    form,
    auth,
    fields,
    kanban,
    list,
    notifications,
    modal,
    ...asyncReducers,
    router: (state, action) => router(asyncReducers.router ? asyncReducers.router(state, action) : {}, action),
});
