import _merge from 'lodash-es/merge';
import {AUTH_INIT, AUTH_INIT_USER, AUTH_SET_DATA, AUTH_ADD_SOCIAL} from '../actions/auth';

const initialState = {
    isInitialized: false,
    initializeCounter: 0,
    redirectPageId: null,
    user: null,
    data: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTH_INIT:
            return {
                ...state,
                initializeCounter: state.initializeCounter + 1,
                redirectPageId: action.redirectPageId || null,
            };

        case AUTH_INIT_USER:
            return {
                ...state,
                isInitialized: true,
                user: action.user,
            };

        case AUTH_SET_DATA:
            return {
                ...state,
                isInitialized: true,
                data: _merge(state.data, action.data),
            };

        case AUTH_ADD_SOCIAL:
            return {
                ...state,
                user: {
                    ...state.user,
                    socials: [
                        ...state.user.socials,
                        action.social,
                    ],
                }
            };
    }

    return state;
};

export const isInitialized = state => state.auth.isInitialized;
export const getInitializeCounter = state => state.auth.initializeCounter;
export const isAuthorized = state => !!state.auth.user;
export const getUser = state => state.auth.user;
export const getUserId = state => state.auth.user && state.auth.user.id || null;
export const getUserRole = state => state.auth.user && state.auth.user.role || null;
export const getData = state => state.auth.data;
