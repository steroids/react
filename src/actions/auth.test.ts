import configureMockStore from 'redux-mock-store';
import {
    AUTH_INIT,
    AUTH_SET_DATA,
    AUTH_INIT_USER,
    AUTH_ADD_SOCIAL,
    init,
    login,
    logout,
    setUser,
    addSocial,
    setData,
} from './auth';
import prepareMiddleware from '../../tests/storeMiddlewareMock';
import componentsMock from '../../tests/componentsMock';

const mockStore = configureMockStore([prepareMiddleware]);
const store = mockStore({});

describe('auth actions', () => {
    beforeEach(() => {
        store.clearActions();
    });

    describe('init', () => {
        it('without skipInitialized', () => {
            const expectedActions = [{
                type: AUTH_INIT,
            }];

            store.dispatch(init());
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('with skipInitialized', () => {
            const mockedStore = mockStore({
                auth: {
                    isInitialized: true,
                },
            });

            const expectedActions = [];

            mockedStore.dispatch(init(true));
            expect(mockedStore.getActions()).toEqual(expectedActions);
        });
    });

    describe('login', () => {
        it('without redirectPageId', () => {
            const token = 'token';
            const expectedActions = [
                {
                    type: AUTH_INIT,
                    redirectPageId: null,
                },
            ];

            store.dispatch(login(token, false));
            expect(componentsMock.http.onLogin).toHaveBeenCalled();
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('with redirectPageId', () => {
            const redirectPageId = 'foo';
            const token = 'token';
            const expectedActions = [
                {
                    type: AUTH_INIT,
                    redirectPageId,
                },
            ];

            store.dispatch(login(token, redirectPageId));
            expect(componentsMock.http.onLogin).toHaveBeenCalled();
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('logout', () => {
        it('without redirectPageId', () => {
            const expectedActions = [
                {
                    type: AUTH_INIT_USER,
                    user: null,
                },
            ];

            store.dispatch(logout(false));
            expect(componentsMock.http.onLogout).toHaveBeenCalled();
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('with redirectPageId', () => {
            const expectedActions = [
                {
                    type: AUTH_INIT_USER,
                    user: null,
                },
                {
                    type: '@@router/CALL_HISTORY_METHOD',
                    payload: {
                        args: [null],
                        method: 'push',
                    },
                },
            ];

            store.dispatch(logout());
            expect(componentsMock.http.onLogout).toHaveBeenCalled();
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('setUser', () => {
        it('with user', () => {
            const user = {
                name: 'John',
            };
            const expectedAction = {
                type: AUTH_INIT_USER,
                user,
            };

            expect(setUser(user)).toEqual(expectedAction);
        });

        it('with null user', () => {
            const expectedAction = {
                type: AUTH_INIT_USER,
                user: null,
            };

            expect(setUser(null)).toEqual(expectedAction);
        });
    });

    it('addSocial', () => {
        const expectedAction = {
            type: AUTH_ADD_SOCIAL,
            social: 'foo',
        };

        expect(addSocial('foo')).toEqual(expectedAction);
    });

    it('setData', () => {
        const expectedAction = {
            type: AUTH_SET_DATA,
            data: 'foo',
        };

        expect(setData('foo')).toEqual(expectedAction);
    });
});
