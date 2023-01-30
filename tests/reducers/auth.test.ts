import {
    AUTH_INIT,
    AUTH_INIT_USER,
    AUTH_SET_DATA,
    AUTH_ADD_SOCIAL,
} from '../../src/actions/auth';
import auth from '../../src/reducers/auth';

describe('auth reducer', () => {
    const initialState = {
        isInitialized: false,
        initializeCounter: 0,
        redirectPageId: null,
        user: null,
        data: null,
    };

    describe('AUTH_INIT', () => {
        it('without redirectPageId', () => {
            const action = {
                type: AUTH_INIT,
            };

            expect(auth(initialState, action)).toEqual({
                ...initialState,
                initializeCounter: initialState.initializeCounter + 1,
                redirectPageId: null,
            });
        });

        it('with redirectPageId', () => {
            const action = {
                type: AUTH_INIT,
                redirectPageId: 'root',
            };

            expect(auth(initialState, action)).toEqual({
                ...initialState,
                initializeCounter: initialState.initializeCounter + 1,
                redirectPageId: action.redirectPageId,
            });
        });
    });

    describe('AUTH_INIT_USER', () => {
        it('without user', () => {
            const action = {
                type: AUTH_INIT_USER,
            };

            expect(auth(initialState, action)).toEqual({
                ...initialState,
                isInitialized: true,
                user: undefined,
            });
        });

        it('with null user', () => {
            const action = {
                type: AUTH_INIT_USER,
                user: null,
            };

            expect(auth(initialState, action)).toEqual({
                ...initialState,
                isInitialized: true,
                user: null,
            });
        });

        it('with user', () => {
            const action = {
                type: AUTH_INIT_USER,
                user: {
                    id: 1,
                    name: 'Ivan',
                },
            };

            expect(auth(initialState, action)).toEqual({
                ...initialState,
                isInitialized: true,
                user: action.user,
            });
        });
    });

    describe('AUTH_SET_DATA', () => {
        it('without data', () => {
            const action = {
                type: AUTH_SET_DATA,
            };

            expect(auth(initialState, action)).toEqual({
                ...initialState,
                data: {},
            });
        });

        it('with null data', () => {
            const action = {
                type: AUTH_SET_DATA,
                user: null,
            };

            expect(auth(initialState, action)).toEqual({
                ...initialState,
                data: {},
            });
        });

        it('with data', () => {
            const action = {
                type: AUTH_SET_DATA,
                data: {
                    title: 'data',
                    value: 42,
                },
            };

            expect(auth(initialState, action)).toEqual({
                ...initialState,
                data: action.data,
            });
        });

        it('with merge data', () => {
            const newInitialState = {
                ...initialState,
                data: {
                    value: 10,
                    name: 'test',
                },
            };

            const action = {
                type: AUTH_SET_DATA,
                data: {
                    title: 'data',
                    value: 42,
                },
            };

            expect(auth(newInitialState, action)).toEqual({
                ...newInitialState,
                data: {
                    title: 'data',
                    value: 42,
                    name: 'test',
                },
            });
        });
    });

    describe('AUTH_ADD_SOCIAL', () => {
        it('without social', () => {
            const action = {
                type: AUTH_ADD_SOCIAL,
            };

            expect(auth(initialState, action)).toEqual({
                ...initialState,
                user: {
                    socials: [],
                },
            });
        });

        it('with null social', () => {
            const action = {
                type: AUTH_ADD_SOCIAL,
                social: null,
            };

            expect(auth(initialState, action)).toEqual({
                ...initialState,
                user: {
                    socials: [],
                },
            });
        });

        it('with social', () => {
            const action = {
                type: AUTH_ADD_SOCIAL,
                social: [
                    {
                        title: 'social',
                        value: 42,
                    },
                ],
            };

            expect(auth(initialState, action)).toEqual({
                ...initialState,
                user: {
                    socials: action.social,
                },
            });
        });

        it('with merge social', () => {
            const newInitalState = {
                ...initialState,
                user: {
                    socials: [{
                        title: 'test',
                        value: 10,
                    }],
                },
            };

            const action = {
                type: AUTH_ADD_SOCIAL,
                social: [{
                    title: 'social',
                    value: 42,
                }],
            };

            expect(auth(newInitalState, action)).toEqual({
                ...newInitalState,
                user: {
                    ...newInitalState.user,
                    socials: [
                        {
                            title: 'test',
                            value: 10,
                        },
                        {
                            title: 'social',
                            value: 42,
                        },

                    ],
                },
            });
        });
    });
});
