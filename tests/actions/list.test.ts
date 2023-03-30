import configureMockStore from 'redux-mock-store';
import {
    add,
    deleteItem,
    listInit,
    listSetItems,
    listSetLayout,
    LIST_INIT,
    LIST_ITEM_ADD,
    LIST_ITEM_DELETE,
    LIST_ITEM_UPDATE,
    LIST_SET_ITEMS,
    LIST_SET_LAYOUT,
    LIST_TOGGLE_ALL,
    LIST_TOGGLE_ITEM,
    toggleAll,
    toggleItem,
    update,
} from '../../src/actions/list';
import prepareMiddleware from '../mocks/storeMiddlewareMock';

const mockStore = configureMockStore([prepareMiddleware]);
const store = mockStore({});

describe('auth actions', () => {
    beforeEach(() => {
        store.clearActions();
    });

    //TODO httpFetchHandler localFetchHandler

    it('listInit', () => {
        const listId = 'list1';

        const payload = {
            listId,
            items: [
                {
                    id: 1,
                    name: 'item1',
                },
            ],
        };

        const expectedActions = [
            {
                type: LIST_INIT,
                payload,
            },
        ];

        store.dispatch(listInit(listId, payload));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('listSetItems', () => {
        const listId = 'list2';
        const items = [{id: 2, name: 'html'}];

        const expectedActions = [
            {
                type: LIST_SET_ITEMS,
                listId,
                items,
            },
        ];

        store.dispatch(listSetItems(listId, items));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('listSetLayout', () => {
        const listId = 'list3';
        const layoutName = 'layoutName';

        const expectedActions = [
            {
                type: LIST_SET_LAYOUT,
                listId,
                layoutName,
            },
        ];

        store.dispatch(listSetLayout(listId, layoutName));
        expect(store.getActions()).toEqual(expectedActions);
    });

    //TODO listFetch listLazyFetch listRefresh listDestroy

    describe('add', () => {
        it('with prepend argument', () => {
            const listId = 'list4';
            const item = {id: 1, name: 'body'};
            const prepend = true;

            const expectedActions = [
                {
                    type: LIST_ITEM_ADD,
                    listId,
                    prepend,
                    item,
                },
            ];

            store.dispatch(add(listId, item, prepend));
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('without prepend argument', () => {
            const listId = 'list5';
            const item = {id: 324, name: 'p'};

            const expectedActions = [
                {
                    type: LIST_ITEM_ADD,
                    listId,
                    item,
                    prepend: false,
                },
            ];

            store.dispatch(add(listId, item));
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('update', () => {
        const listId = 'list6';
        const item = {id: 873287, name: 'address'};
        const condition = {id: 1, name: 'list6'};

        const expectedActions = [
            {
                type: LIST_ITEM_UPDATE,
                item,
                listId,
                condition,
            },
        ];

        store.dispatch(update(listId, item, condition));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('deleteItem', () => {
        const listId = 'list7';
        const condition = {id: 1, name: 'list12'};

        const expectedActions = [
            {
                type: LIST_ITEM_DELETE,
                listId,
                condition,
            },
        ];

        store.dispatch(deleteItem(listId, condition));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('toggleItem', () => {
        const listId = 'list7';
        const itemId = 'item1';

        const expectedActions = [
            {
                type: LIST_TOGGLE_ITEM,
                listId,
                itemId,
            },
        ];

        store.dispatch(toggleItem(listId, itemId));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('toggleAll', () => {
        const listId = 'list8';

        const expectedActions = [
            {
                type: LIST_TOGGLE_ALL,
                listId,
            },
        ];

        store.dispatch(toggleAll(listId));
        expect(store.getActions()).toEqual(expectedActions);
    });
});
