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

describe('fields actions', () => {
    beforeEach(() => {
        store.clearActions();
    });

    it('setMeta', () => {
        const meta = {meta: 'meta'};

        const expectedActions = [
            {
                type: FIELDS_SET_META,
                meta,
            },
        ];

        store.dispatch(setMeta(meta));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('fieldsDataProviderSetItems', () => {
        const dataProviderId = '0';
        const mockedItems = {item1: 'item1', item2: false};

        const expectedActions = [
            {
                type: FIELDS_DATA_PROVIDER_SET_ITEMS,
                dataProviderId,
                items: mockedItems,
            },
        ];

        store.dispatch(fieldsDataProviderSetItems(dataProviderId, mockedItems));

        expect(store.getActions()).toEqual(expectedActions);
    });
});
