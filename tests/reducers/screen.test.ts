import {SCREEN_SET_WIDTH, SCREEN_SET_MEDIA} from '../../src/actions/screen';

import screen, {
    getDeviceType,
    isDesktop,
    isPhone,
    isTablet,
    SCREEN_DESKTOP,
    SCREEN_PHONE,
    SCREEN_TABLET,
} from '../../src/reducers/screen';

describe('screen reducers', () => {
    let initialState = {
        width: 1280,
        media: {
            [SCREEN_PHONE]: 320,
            [SCREEN_TABLET]: 768,
            [SCREEN_DESKTOP]: 1024,
        },
    };
    beforeEach(() => {
        initialState = {
            width: 1280,
            media: {
                [SCREEN_PHONE]: 320,
                [SCREEN_TABLET]: 768,
                [SCREEN_DESKTOP]: 1024,
            },
        };
    });

    it(SCREEN_SET_WIDTH, () => {
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
    it(SCREEN_SET_MEDIA, () => {
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
        it(SCREEN_PHONE, () => {
            const state = {
                ...initialState,
                width: 320,
            };

            expect(getDeviceType(state)).toBe(SCREEN_PHONE);
        });
        it(SCREEN_TABLET, () => {
            const state = {
                ...initialState,
                width: 768,
            };

            expect(getDeviceType(state)).toBe(SCREEN_TABLET);
        });
        it(SCREEN_DESKTOP, () => {
            const state = {
                ...initialState,
            };

            expect(getDeviceType(state)).toBe(SCREEN_DESKTOP);
        });
    });

    it('isPhone', () => {
        const state = {
            ...initialState,
        };
        expect(isPhone(state)).not.toBe(true);

        state.width = 320;

        expect(isPhone(state)).toBe(true);
    });
    it('isTablet', () => {
        const state = {
            ...initialState,
        };
        expect(isTablet(state)).not.toBe(true);

        state.width = 768;

        expect(isTablet(state)).toBe(true);
    });
    it('isDesktop', () => {
        const state = {
            ...initialState,
            width: 320,
        };
        expect(isDesktop(state)).not.toBe(true);

        state.width = 1024;

        expect(isDesktop(state)).toBe(true);
    });
});
