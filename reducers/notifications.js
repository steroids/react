import {NOTIFICATIONS_SHOW, NOTIFICATIONS_CLOSING, NOTIFICATIONS_CLOSE} from '../actions/notifications';

const initialState = {
    items: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case NOTIFICATIONS_SHOW:
            return {
                ...state,
                items: []
                    .concat(state.items)
                    .filter(item => item.level !== action.level || item.message !== action.message) // unique
                    .concat([{
                        id: action.id,
                        level: action.level || 'info',
                        message: action.message,
                        isClosing: false,
                    }]),
            };

        case NOTIFICATIONS_CLOSING:
            return {
                ...state,
                items: [].concat(state.items).map(item => {
                    if (item.id === action.id) {
                        item.isClosing = true;
                    }
                    return item;
                }),
            };

        case NOTIFICATIONS_CLOSE:
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.id),
            };

        default:
            return state;
    }
};

export const getNotifications = (state) => state.notifications.items;
