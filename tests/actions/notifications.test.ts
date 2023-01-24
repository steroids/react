import configureMockStore from 'redux-mock-store';

import prepareMiddleware from '../storeMiddlewareMock';

import {
    closeNotification,
    NOTIFICATIONS_CLOSE,
    NOTIFICATIONS_SHOW,
    showNotification,
} from '../../src/actions/notifications';

const mockStore = configureMockStore([prepareMiddleware]);
const store = mockStore({});

describe('actions notifications', () => {
    beforeEach(() => {
        store.clearActions();
    });

    describe('closeNotification', () => {
        it('without arguments', () => {
            const expectedActions = [
                {
                    type: NOTIFICATIONS_CLOSE,
                    id: null,
                },
            ];

            store.dispatch(closeNotification());

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('with id', () => {
            const id = 'notification3';

            const expectedActions = [
                {
                    type: NOTIFICATIONS_CLOSE,
                    id,
                },
            ];

            store.dispatch(closeNotification(id));
            expect(store.getActions()).toEqual(expectedActions);
        });

        //ToDO
        // - showNotification
        // - closeNotification
        describe('showNotification', () => {
            //message = ... , level = null, params = def

            it('with default arguments', () => {
                const message = 'You won 1000000 dollars';
                const level = 'primary';
                const id = 1;

                const expectedActions = [
                    {
                        type: NOTIFICATIONS_SHOW,
                    },
                ];

                store.dispatch(showNotification(message, level));
            });
        });
    });
});
