import {
    IList,
    LIST_BEFORE_FETCH,
    LIST_DESTROY,
    LIST_INIT,
    LIST_SET_ITEMS,
    LIST_TOGGLE_ALL,
    LIST_SET_LAYOUT,
    LIST_TOGGLE_ITEM,
    LIST_ITEM_DELETE,
    LIST_ITEM_UPDATE,
    LIST_AFTER_FETCH,
    LIST_ITEM_ADD,
} from '../../../src/actions/list';
import list from '../../../src/reducers/list';

type TListCommonArg = Record<string, any> | null;

describe('list reducers', () => {
    const defaultInitialState = {
        lists: {},
        selectedIds: {},
    };

    let initialState = {...defaultInitialState};

    const getStateWithLists = (
        listsData: TListCommonArg = null,
        selectedIdsData: TListCommonArg = null,
    ) => ({
        lists: {
            ...listsData,
        },
        selectedIds: {
            ...selectedIdsData,
        },
    });

    beforeEach(() => {
        initialState = {...defaultInitialState};
    });

    describe('default action', () => {
        it('should return state', () => {
            const action = {
                type: 'default',
            };

            const expectedState = {...initialState};

            expect(list(initialState, action)).toEqual(expectedState);
        });
    });

    describe('LIST_INIT', () => {
        it('with total prop', () => {
            const action = {
                type: LIST_INIT,
                total: 0,
                items: [],
                payload: {
                    formId: '10',
                    listId: '1',
                },
            };

            const list2 = {
                listId: '2',
                items: [],
            };

            const state = getStateWithLists({2: list2});

            const expectedState = {
                ...initialState,
                lists: {
                    2: list2,
                    1: {
                        meta: {},
                        total: action.total,
                        isFetched: false,
                        isLoading: false,
                        ...action.payload,
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });

        it('without total prop', () => {
            const action = {
                type: LIST_INIT,
                items: [],
                payload: {
                    formId: '10',
                    listId: '1',
                },
            };

            const list2 = {
                listId: '2',
                items: [],
            };

            const state = getStateWithLists({2: list2});

            const expectedState = {
                ...initialState,
                lists: {
                    2: list2,
                    1: {
                        meta: {},
                        total: action.items.length,
                        isFetched: false,
                        isLoading: false,
                        ...action.payload,
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });
    });

    describe('LIST_SET_ITEMS', () => {
        it('default behavior', () => {
            const listId = '10';

            const action = {
                type: LIST_SET_ITEMS,
                listId: '10',
                items: [],
            };

            const lists = {
                2: {
                    items: [],
                },
                [listId]: {
                    isLoading: true,
                },
            };

            const state = getStateWithLists(lists);

            const expectedState = {
                ...initialState,
                lists: {
                    ...state.lists,
                    [listId]: {
                        ...state.lists[listId],
                        items: action.items,
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });
    });

    describe('LIST_BEFORE_FETCH', () => {
        it('default behavior', () => {
            const listId = '10';

            const action = {
                type: LIST_BEFORE_FETCH,
                listId,
            };

            const listItem: IList = {
                isLoading: false,
                isRemote: false,
            };

            const state = getStateWithLists({[listId]: listItem});

            const expectedState = {
                ...initialState,
                lists: {
                    [action.listId]: {
                        ...listItem,
                        isLoading: true,
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });
    });

    describe('LIST_AFTER_FETCH', () => {
        it('items match', () => {
            const listId = '5';
            const items = [
                {
                    primaryKey: 'key',
                },
            ];

            const action = {
                type: LIST_AFTER_FETCH,
                items,
                listId,
            };

            const listItem: IList = {
                isLoading: false,
                isRemote: false,
                items,
            };

            const state = getStateWithLists({[listId]: listItem});

            const expectedState = {
                ...state,
                lists: {
                    [listId]: {
                        ...listItem,
                        ...action,
                        isFetched: true,
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });

        it('with list loadMore and action page', () => {
            const listId = '5';

            const action = {
                type: LIST_AFTER_FETCH,
                items: [
                    {
                        id: 'item3',
                    },
                ],
                listId,
                page: 2,
                pageSize: 1,
            };

            const listItem: IList = {
                isLoading: false,
                isRemote: false,
                items: [
                    {
                        id: 'item1',
                    },
                    {
                        id: 'item2',
                    },
                ],
                loadMore: true,
            };

            const state = getStateWithLists({[listId]: listItem});

            const expectedState = {
                ...state,
                lists: {
                    [listId]: {
                        ...listItem,
                        ...action,
                        isFetched: true,
                        items: [
                            {
                                id: 'item1',
                            },
                            {
                                id: 'item3',
                            },
                        ],
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });

        it('list without items', () => {
            const listId = '5';
            const items = [
                {
                    primaryKey: 'key',
                },
            ];

            const action = {
                type: LIST_AFTER_FETCH,
                items,
                listId,
            };

            const listItem: IList = {
                isLoading: false,
                isRemote: false,
            };

            const state = getStateWithLists({[listId]: listItem});

            const expectedState = {
                ...state,
                lists: {
                    [listId]: {
                        ...listItem,
                        ...action,
                        isFetched: true,
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });
    });

    describe('LIST_ITEM_ADD', () => {
        it('with prepend true', () => {
            const listId = '2';
            const item1 = {
                id: 'item1',
            };
            const item2 = {
                id: 'item2',
            };

            const action = {
                type: LIST_ITEM_ADD,
                prepend: true,
                listId,
                item: item2,
            };

            const listItem: IList = {
                listId,
                formId: '30',
                items: [item1],
            };

            const state = getStateWithLists({[listId]: listItem});

            const expectedState = {
                ...state,
                lists: {
                    [listId]: {
                        ...listItem,
                        items: [item2, item1],
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });

        it('with prepend false', () => {
            const listId = '2';
            const item1 = {
                id: 'item1',
            };
            const item2 = {
                id: 'item2',
            };

            const action = {
                type: LIST_ITEM_ADD,
                prepend: false,
                listId,
                item: item2,
            };

            const listItem: IList = {
                listId,
                formId: '30',
                items: [item1],
            };

            const state = getStateWithLists({[listId]: listItem});

            const expectedState = {
                ...state,
                lists: {
                    [listId]: {
                        ...listItem,
                        items: [item1, item2],
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });
    });

    describe('LIST_ITEM_UPDATE', () => {
        it('condition match', () => {
            const listId = '10';
            const action = {
                type: LIST_ITEM_UPDATE,
                condition: {
                    primaryKey: 'key',
                },
                listId,
                item: {
                    listId,
                },
            };

            const listItem: IList = {
                isLoading: false,
                isRemote: false,
                isFetched: false,
                items: [
                    {
                        primaryKey: 'key',
                    },
                ],
            };

            const state = getStateWithLists({
                [listId]: listItem,
            });

            const expectedState = {
                ...state,
                lists: {
                    [listId]: {
                        ...listItem,
                        items: [
                            {
                                ...action.condition,
                                ...action.item,
                            },
                        ],
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });

        it('condition not match', () => {
            const listId = '10';
            const action = {
                type: LIST_ITEM_UPDATE,
                condition: {
                    someProp: 'someProp',
                },
                listId,
                item: {
                    listId,
                },
            };

            const listItem: IList = {
                isLoading: false,
                isRemote: false,
                isFetched: false,
                items: [
                    {
                        primaryKey: 'key',
                    },
                ],
            };

            const state = getStateWithLists({
                [listId]: listItem,
            });

            const expectedResult = {...state};

            expect(list(state, action)).toEqual(expectedResult);
        });
    });

    describe('LIST_ITEM_DELETE', () => {
        it('default behavior', () => {
            const listId = '10';

            const action = {
                type: LIST_ITEM_DELETE,
                listId,
                condition: {
                    primaryKey: 'key',
                },
            };

            const listItem: IList = {
                isLoading: false,
                items: [
                    {
                        primaryKey: 'key',
                    },
                ],
                loadMore: false,
            };

            const state = getStateWithLists({
                [listId]: listItem,
            });

            const expectedState = {
                ...state,
                lists: {
                    [listId]: {
                        ...listItem,
                        items: [],
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });
    });

    describe('LIST_DESTROY', () => {
        it('default behavior', () => {
            const listId = '10';
            const action = {
                type: LIST_DESTROY,
                listId,
            };

            const state = getStateWithLists({
                [listId]: {
                    isFetched: true,
                    items: [],
                    isLoading: false,
                },
            });

            const expectedState = {
                ...initialState,
                lists: {},
            };

            expect(list(state, action)).toEqual(expectedState);
        });
    });

    describe('LIST_TOGGLE_ITEM', () => {
        it('with not existing itemId', () => {
            const itemId = '10';
            const listId = '1';
            const action = {
                type: LIST_TOGGLE_ITEM,
                itemId,
                listId,
            };

            const selectedIds = {
                [listId]: [],
            };

            const state = getStateWithLists({}, selectedIds);

            const expectedState = {
                ...state,
                selectedIds: {
                    [listId]: [itemId],
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });

        it('with existing itemId', () => {
            const itemId = '10';
            const listId = '1';
            const action = {
                type: LIST_TOGGLE_ITEM,
                itemId,
                listId,
            };

            const selectedIds = {
                [listId]: [itemId],
            };

            const state = getStateWithLists({}, selectedIds);

            const expectedState = {
                ...state,
                selectedIds: {
                    [listId]: [],
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });
    });

    describe('LIST_TOGGLE_ALL', () => {
        it('should return empty array', () => {
            const listId = '11';
            const primaryKey = 'key';
            const action = {
                type: LIST_TOGGLE_ALL,
                listId,
            };

            const lists = {
                10: {
                    items: [
                        {
                            [primaryKey]: 'item1',
                        },
                    ],
                    primaryKey,
                },
            };

            const state = getStateWithLists(lists);

            const expectedResult = [];

            expect(list(state, action)).toEqual(expectedResult);
        });

        it('all ids selected', () => {
            const listId = '11';
            const primaryKey = 'key';
            const itemId = 'item1';
            const action = {
                type: LIST_TOGGLE_ALL,
                listId,
            };

            const lists = {
                [listId]: {
                    items: [
                        {
                            [primaryKey]: itemId,
                        },
                    ],
                    primaryKey,
                },
            };

            const selectedIds = {
                [listId]: [itemId],
            };

            const state = getStateWithLists(lists, selectedIds);

            const expectedState = {
                ...state,
                selectedIds: {
                    [listId]: [],
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });

        it('one id selected', () => {
            const listId = '11';
            const primaryKey = 'key';
            const action = {
                type: LIST_TOGGLE_ALL,
                listId,
            };

            const item1 = {
                [primaryKey]: 'item1',
            };

            const item2 = {
                [primaryKey]: 'item2',
            };

            const lists = {
                [listId]: {
                    items: [item1, item2],
                    primaryKey,
                },
            };

            const selectedIds = {
                [listId]: [item1[primaryKey]],
            };

            const state = getStateWithLists(lists, selectedIds);

            const expectedState = {
                ...state,
                selectedIds: {
                    [listId]: [item1[primaryKey], item2[primaryKey]],
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });
    });

    describe('LIST_SET_LAYOUT', () => {
        it('default behavior', () => {
            const listId = '10';
            const layoutName = 'layout';
            const action = {
                type: LIST_SET_LAYOUT,
                listId,
                layoutName,
            };

            const listItem = {
                items: [],
                formId: '1',
                listId,
            } as IList;

            const state = getStateWithLists({[listId]: listItem});

            const expectedState = {
                ...state,
                lists: {
                    [listId]: {
                        ...listItem,
                        layoutName,
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });
    });
});
