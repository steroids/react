import {SCREEN_SET_WIDTH, SCREEN_SET_MEDIA} from '../actions/screen';

export const SCREEN_PHONE = 'phone';
export const SCREEN_TABLET = 'tablet';
export const SCREEN_DESKTOP = 'desktop';

export type TMediaDevice =
    | typeof SCREEN_PHONE
    | typeof SCREEN_TABLET
    | typeof SCREEN_DESKTOP;

export interface IScreenInitialState {
    width: number;
    media: {
        [key in TMediaDevice]: number;
    };
}

const initialState: IScreenInitialState = {
    width: 1280,
    media: {
        [SCREEN_PHONE]: 320,
        [SCREEN_TABLET]: 768,
        [SCREEN_DESKTOP]: 1024,
    },
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SCREEN_SET_WIDTH:
            return {
                ...state,
                width: action.width,
            };
        case SCREEN_SET_MEDIA:
            return {
                ...state,
                media: {
                    ...state.media,
                    ...action.media,
                },
            };
        default:
            return state;
    }
};

export const getDeviceType = state => {
    if (state.screen.width < state.screen.media[SCREEN_TABLET]) {
        return SCREEN_PHONE;
    }
    if (state.screen.width < state.screen.media[SCREEN_DESKTOP]) {
        return SCREEN_TABLET;
    }
    return SCREEN_DESKTOP;
};
export const isPhone = state => getDeviceType(state) === SCREEN_PHONE;
export const isTablet = state => getDeviceType(state) === SCREEN_TABLET;
export const isDesktop = state => getDeviceType(state) === SCREEN_DESKTOP;
