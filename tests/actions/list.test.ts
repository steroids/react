import configureMockStore from 'redux-mock-store';
import axios from 'axios';
import {
    IList,
    add,
    deleteItem,
    listInit,
    listSetItems,
    listSetLayout,
    toggleAll,
    toggleItem,
    update,
    httpFetchHandler,
    localFetchHandler,
    LIST_INIT,
    LIST_ITEM_ADD,
    LIST_ITEM_DELETE,
    LIST_ITEM_UPDATE,
    LIST_SET_ITEMS,
    LIST_SET_LAYOUT,
    LIST_TOGGLE_ALL,
    LIST_TOGGLE_ITEM,
} from '../../src/actions/list';
import prepareMiddleware from '../mocks/storeMiddlewareMock';

describe('httpFetchHandler function', () => {
    const expectedData = 'mockData';
    const mockHttp = {
        send: jest.fn().mockResolvedValue({data: expectedData}),
    };
    const mockList: IList = {
        action: '/api/v1/mock',
        actionMethod: 'GET',
        scope: ['mockScope1', 'mockScope2'],
    };
    const mockQuery = {
        page: 1,
        pageSize: 50,
    };

    // Добавляем заглушку токена — тестируем, что он пробрасывается в options
    const mockCancelSource = axios.CancelToken.source();
    const mockComponents = {
        http: mockHttp,
    };

    beforeEach(() => {
        mockHttp.send.mockClear();
    });

    it('should call http.send with correct parameters including cancelToken option', async () => {
        const expectedUrl = `${mockList.action}?scope=${mockList.scope.join(',')}`;

        // Передаём options с cancelToken как 4-й аргумент
        await httpFetchHandler(mockList, mockQuery, mockComponents, {cancelToken: mockCancelSource.token});

        expect(mockHttp.send).toHaveBeenCalledWith(
            mockList.actionMethod,
            expectedUrl,
            mockQuery,
            {cancelToken: mockCancelSource.token},
        );
    });

    it('should return correct data', async () => {
        const result = await httpFetchHandler(mockList, mockQuery, mockComponents);

        expect(result).toEqual(expectedData);
    });

    it('should call onError when http.send throws an error and rethrow', async () => {
        const mockError = new Error('mockError');
        mockHttp.send.mockRejectedValueOnce(mockError);
        mockList.onError = jest.fn();

        await expect(httpFetchHandler(mockList, mockQuery, mockComponents)).rejects.toBe(mockError);
        expect(mockList.onError).toHaveBeenCalledWith(mockError);
    });
});

describe('localFetchHandler', () => {
    const items = [
        {
            id: 1,
            departureCity: 'Moscow',
            destinationCity: 'Kaliningrad',
            distance: 100,
        },
        {
            id: 2,
            departureCity: 'Yekaterinburg',
            destinationCity: 'Vladivostok',
            distance: 200,
        },
        {
            id: 3,
            departureCity: 'Novosibirsk',
            destinationCity: 'Yekaterinburg',
            distance: 852,
        },
        {
            id: 4,
            departureCity: 'Moscow',
            destinationCity: 'Kazan',
            distance: 268,
        },
    ];

    const mockList: IList = {
        items,
        pageAttribute: 'page',
        pageSizeAttribute: 'pageSize',
        sortAttribute: 'distance',
        sourceItems: items,
    };

    it('should correctly filter items', () => {
        const expectedFilteredItems = [
            items[0], items[3],
        ];

        const result = localFetchHandler(mockList, {
            departureCity: 'moscow',
        });

        expect(result.items).toEqual(expectedFilteredItems);
        expect(result.total).toBe(expectedFilteredItems.length);
    });

    it('should correctly sort items', () => {
        const expectedSortedItems = [...items].sort((item1, item2) => item1.distance - item2.distance);

        const result = localFetchHandler(mockList, {
            distance: 'distance',
        });

        expect(result.items).toEqual(expectedSortedItems);
        expect(result.total).toBe(expectedSortedItems.length);
    });

    it('should correctly paginate items', () => {
        const expectedFilteredItems = [
            items[1],
        ];

        const result = localFetchHandler(mockList, {
            page: 2,
            pageSize: 1,
        });

        expect(result.items).toEqual(expectedFilteredItems);
    });

    it('should correctly handle null or undefined query values', () => {
        const result = localFetchHandler(mockList, {
            page: null,
            pageSize: undefined,
        });

        expect(result.items).toEqual(items);
        expect(result.total).toBe(items.length);
    });

    it('should return an empty array when items is empty', () => {
        const expectedResult = {
            items: [],
            total: 0,
        };

        const result = localFetchHandler({
            ...mockList,
            items: [],
            sourceItems: [],
        }, {});

        expect(result.items).toEqual(expectedResult.items);
        expect(result.total).toEqual(expectedResult.total);
    });

    it('should return all items when query are not provided', () => {
        const result = localFetchHandler(mockList, {});

        expect(result.items).toEqual(mockList.items);
        expect(result.total).toBe(mockList.items.length);
    });

    it('should return the same items when items are equal to sourceItems', () => {
        const result = localFetchHandler(mockList, {});

        expect(result.items).toEqual(items);
    });
});

const mockStore = configureMockStore([prepareMiddleware]);
const store = mockStore({});

describe('auth actions', () => {
    beforeEach(() => {
        store.clearActions();
    });

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
        const items = [{
            id: 2,
            name: 'html',
        }];

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
            const item = {
                id: 1,
                name: 'body',
            };
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
            const item = {
                id: 324,
                name: 'p',
            };

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
        const item = {
            id: 873287,
            name: 'address',
        };
        const condition = {
            id: 1,
            name: 'list6',
        };

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
        const condition = {
            id: 1,
            name: 'list12',
        };

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
