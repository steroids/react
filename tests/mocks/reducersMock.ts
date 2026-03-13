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
export default asyncReducers => combineReducers({
    form,
    auth,
    fields,
    list,
    notifications,
    modal,
    kanban,
    ...asyncReducers,
    router: (state, action) => router(asyncReducers.router ? asyncReducers.router(state, action) : {}, action),
});
