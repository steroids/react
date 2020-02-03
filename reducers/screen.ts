import {SCREEN_SET_WIDTH, SCREEN_SET_MEDIA} from '../actions/screen';

export const SCREE_PHONE = 'phone';
export const SCREEN_TABLET = 'tablet';
export const SCREEN_DESKTOP = 'desktop';
const initialState = {
    width: 1280,
    media: {
        [SCREE_PHONE]: 320,
        [SCREEN_TABLET]: 768,
        [SCREEN_DESKTOP]: 1024
    }
};
export default (state = initialState, action) => {
    switch (action.type) {
        case SCREEN_SET_WIDTH:
            return {
                ...state,
                width: action.width
            };
        case SCREEN_SET_MEDIA:
            return {
                ...state,
                media: {
                    ...state.media,
                    ...action.media
                }
            };
    }
    return state;
};
export const getDeviceType = state => {
    if (state.screen.width < state.screen.media[SCREEN_TABLET]) {
        return SCREE_PHONE;
    }
    if (state.screen.width < state.screen.media[SCREEN_DESKTOP]) {
        return SCREEN_TABLET;
    }
    return SCREEN_DESKTOP;
};
export const isPhone = state => getDeviceType(state) === SCREE_PHONE;
export const isTablet = state => getDeviceType(state) === SCREEN_TABLET;
export const isDesktop = state => getDeviceType(state) === SCREEN_DESKTOP;
