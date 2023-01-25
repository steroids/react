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

        describe('showNotification', () => {
            it('with default arguments', () => {
                const message = 'You won 1000000 dollars';

                const expectedActions = [
                    {
                        type: NOTIFICATIONS_SHOW,
                        id: '1',
                        message,
                        level: 'success',
                        position: 'top-right',
                    },
                ];

                store.dispatch(showNotification(message));
                expect(store.getActions()).toEqual(expectedActions);
            });

            it('with level argument', () => {
                const message = 'This button will blow up you computer ^_^';
                const level = 'primary';

                const expectedActions = [
                    {
                        type: NOTIFICATIONS_SHOW,
                        id: '2',
                        message,
                        level,
                        position: 'top-right',
                    },
                ];

                store.dispatch(showNotification(message, level));
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        describe('setFlashes', () => {
            it('with filled flashes', () => {
                const infoMessage = 'This bicycle is 20% off ';

                const flashes = {
                    info: infoMessage,
                };

                const expectedActions = [
                    {
                        type: NOTIFICATIONS_SHOW,
                        id: '3',
                        message: infoMessage,
                        level: 'info',
                        position: 'top-right',
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
