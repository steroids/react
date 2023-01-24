import configureMockStore from 'redux-mock-store';

import prepareMiddleware from '../storeMiddlewareMock';

import {
    closeNotification,
    NOTIFICATIONS_CLOSE,
    NOTIFICATIONS_SHOW,
    setFlashes,
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
            const id = null;

            const expectedActions = [
                {
                    type: NOTIFICATIONS_CLOSE,
                    id,
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

        describe('showNotification', () => {
            //message = ... , level = null, params = def

            it('with default arguments', () => {
                const message = 'You won 1000000 dollars';
                const level = 'success';
                const notificationId = '1';
                const position = 'top-right';

                const expectedActions = [
                    {
                        type: NOTIFICATIONS_SHOW,
                        id: notificationId,
                        message,
                        level,
                        position,
                    },
                ];

                store.dispatch(showNotification(message));
                expect(store.getActions()).toEqual(expectedActions);
            });

            // message = ... , level = ..., params = def

            it('with level argument', () => {
                const message = 'This button will blow up you computer ^_^';
                const level = 'primary';
                const notificationId = '2';
                const position = 'top-right';

                const expectedActions = [
                    {
                        type: NOTIFICATIONS_SHOW,
                        id: notificationId,
                        message,
                        level,
                        position,
                    },
                ];

                store.dispatch(showNotification(message, level));
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        describe('setFlashes', () => {
            it('with filled flashes', () => {
                const infoMessage = 'This bycycle is 20% off ';
                const notificationId = '3';
                const level = 'info';
                const position = 'top-right';

                const flashes = {
                    info: infoMessage,
                };

                const expectedActions = [
                    {
                        type: NOTIFICATIONS_SHOW,
                        id: notificationId,
                        message: infoMessage,
                        level,
                        position,
                    },
                ];

                store.dispatch(setFlashes(flashes));
                expect(store.getActions()).toEqual(expectedActions);
            });
            it('with empty flashes', () => {
                const flashes = {};

                const expectedActions = [];

                store.dispatch(setFlashes(flashes));

                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });
});
