import {
    NOTIFICATIONS_SHOW,
    NOTIFICATIONS_CLOSING,
    NOTIFICATIONS_CLOSE
} from '../actions/notifications';

const initialState = {
    items: [],
    position: ''
};
export default (state = initialState, action) => {
    switch (action.type) {
        case NOTIFICATIONS_SHOW:
            return {
                ...state,
                items: []
                    .concat(state.items)
                    .concat([
                        {
                            id: action.id,
                            level: action.level || 'info',
                            message: action.message,
                            isClosing: false,
                            position: action.position
                        }
                    ]),
                position: action.position
            };
        case NOTIFICATIONS_CLOSE:
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.id)
            };
        default:
            return state;
    }
};
export const getNotifications = state => state.notifications.items;
export const getPosition = state => state.notifications.position;