import {SCREEN_SET_WIDTH, SCREEN_SET_MEDIA} from '../../src/actions/screen';

import screen, {
    getDeviceType,
    IScreenInitialState,
    isDesktop,
    isPhone,
    isTablet,
    SCREEN_DESKTOP,
    SCREEN_PHONE,
    SCREEN_TABLET,
} from '../../src/reducers/screen';

interface IGlobalStateWithScreen {
    screen: IScreenInitialState;
}

const checkIsDevice = (
    state: IGlobalStateWithScreen,
    fn: (state: IGlobalStateWithScreen) => boolean,
    width: number,
) => {
    expect(fn(state)).toBe(false);
    state.screen.width = width;
    expect(fn(state)).toBe(true);
};

describe('screen reducers', () => {
    const defaultInitialState: IScreenInitialState = {
        width: 1280,
        media: {
            [SCREEN_PHONE]: 320,
            [SCREEN_TABLET]: 768,
            [SCREEN_DESKTOP]: 1024,
        },
    };

    let initialState: IScreenInitialState = {...defaultInitialState};

    beforeEach(() => {
        initialState = {...defaultInitialState};
    });

    it('SCREEN_SET_WIDTH', () => {
        const width = 3260;

        const action = {
            type: SCREEN_SET_WIDTH,
            width,
        };

        const expectedState = {
            ...initialState,
            width,
        };

        expect(screen(initialState, action)).toEqual(expectedState);
    });

    it('SCREEN_SET_MEDIA', () => {
        const action = {
            type: SCREEN_SET_MEDIA,
            media: {
                iphoneXScreen: 415,
            },
        };

        const expectedState = {
            ...initialState,
            media: {
                ...initialState.media,
                ...action.media,
            },
        };

        expect(screen(initialState, action)).toEqual(expectedState);
    });

    describe('getDeviceType', () => {
        it('SCREEN_PHONE', () => {
            const state = {
                screen: {...initialState, width: 320},
            };

            expect(getDeviceType(state)).toBe(SCREEN_PHONE);
        });

        it('SCREEN_TABLET', () => {
            const state = {
                screen: {...initialState, width: 768},
            };

            expect(getDeviceType(state)).toBe(SCREEN_TABLET);
        });

        it('SCREEN_DESKTOP', () => {
            const state = {
                screen: {...initialState},
            };

            expect(getDeviceType(state)).toBe(SCREEN_DESKTOP);
        });
    });

    it('isPhone', () => {
        const state = {
            screen: {...initialState},
        };

        checkIsDevice(state, isPhone, 320);
    });

    it('isTablet', () => {
        const state = {
            screen: {...initialState},
        };

        checkIsDevice(state, isTablet, 768);
    });

    it('isDesktop', () => {
        const state = {
            screen: {...initialState, width: 320},
        };

        checkIsDevice(state, isDesktop, 1024);
    });
});
