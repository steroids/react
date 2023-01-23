import configureMockStore from 'redux-mock-store';

import prepareMiddleware from '../storeMiddlewareMock';

import {
    FIELDS_SET_META,
    FIELDS_DATA_PROVIDER_SET_ITEMS,
    setMeta,
    fieldsDataProviderSetItems,
} from '../../src/actions/fields';

const mockStore = configureMockStore([prepareMiddleware]);
const store = mockStore({});

const mockedMeta = { meta: 'meta' };

describe('fields actions', () => {
    beforeEach(() => {
        store.clearActions();
    });

    it('setMeta', () => {
        const expectedActions = [
            {
                type: FIELDS_SET_META,
                meta: mockedMeta,
            },
        ];

        store.dispatch(setMeta(mockedMeta));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('fieldsDataProviderSetItems', () => {
        const mockedDataProviderId = '0';
        const mockedItems = { item1: 'item1', item2: false };

        const expectedActions = [
            {
                type: FIELDS_DATA_PROVIDER_SET_ITEMS,
                dataProviderId: mockedDataProviderId,
                items: mockedItems,
            },
        ];

        store.dispatch(
            fieldsDataProviderSetItems(mockedDataProviderId, mockedItems),
        );

        expect(store.getActions()).toEqual(expectedActions);
    });
});
