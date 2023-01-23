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

describe('actions screen', () => {
    beforeEach(() => {
        store.clearActions();
    });

    it('setMedia', () => {
        const mockMedia = {
            viewport: '1200px',
        };

        const expectedActions = [
            {
                type: SCREEN_SET_MEDIA,
                media: mockMedia,
            },
        ];

        store.dispatch(setMedia(mockMedia));
    });

    describe('setWidth', () => {
        const mockWidth = '1200px';

        const expectedActions = [
            {
                type: SCREEN_SET_WIDTH,
                width: mockWidth,
            },
        ];

        it('with skip timeout', () => {
            store.dispatch(setWidth(mockWidth, true));

            expect(store.getActions()).toEqual(expectedActions);
        });

        //TODO
        // Дописать тест после таймаута

        it('without skip timeout', () => {
            store.dispatch(setWidth(mockWidth));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
