import configureMockStore from 'redux-mock-store';

import {
    SCREEN_SET_MEDIA,
    SCREEN_SET_WIDTH,
    setMedia,
    setWidth,
} from '../../src/actions/screen';

import prepareMiddleware from '../storeMiddlewareMock';

const mockStore = configureMockStore([prepareMiddleware]);
const store = mockStore({});

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('actions screen', () => {
    beforeEach(() => {
        store.clearActions();
    });

    it('setMedia', () => {
        const media = {
            viewport: '1200px',
        };

        const expectedActions = [
            {
                type: SCREEN_SET_MEDIA,
                media,
            },
        ];

        store.dispatch(setMedia(media));
        expect(store.getActions()).toEqual(expectedActions);
    });

    describe('setWidth', () => {
        const width = '1200px';

        const expectedActions = [
            {
                type: SCREEN_SET_WIDTH,
                width,
            },
        ];

        it('with skip timeout', () => {
            store.dispatch(setWidth(width, true));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('without skip timeout', () => {
            store.dispatch(setWidth(width));

            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 100);

            jest.runAllTimers();

            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
