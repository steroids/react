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
        const payloadList = 'payloadList';
        const existingList = 'existingList';

        const action: Record<string, any> = {
            type: LIST_INIT,
            total: 0,
            items: [],
            payload: {
                formId: 'formId',
                listId: payloadList,
            },
        };

        const state = getStateWithLists({
            [existingList]: {
                listId: existingList,
                items: [],
            },
        });

        const expectedState = {
            ...initialState,
            lists: {
                [payloadList]: {
                    meta: {},
                    total: 0,
                    isFetched: false,
                    isLoading: false,
                    ...action.payload,
                },
                [existingList]: state.lists[existingList],
            },
        };

        it('with total prop', () => {
            expectedState.lists[payloadList].total = action.total;
            expect(list(state, action)).toEqual(expectedState);
        });

        it('without total prop', () => {
            action.total = null;
            expect(list(state, action)).toEqual(expectedState);
        });
    });

    describe('LIST_SET_ITEMS', () => {
        it('default behavior', () => {
            const listId = 'listId';

            const action = {
                type: LIST_SET_ITEMS,
                listId,
                items: [],
            };

            const lists = {
                existingList: {
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
            const listId = 'listId';

            const action = {
                type: LIST_BEFORE_FETCH,
                listId,
            };

            const listProperties: IList = {
                isLoading: false,
                isRemote: false,
            };

            const state = getStateWithLists({[listId]: listProperties});

            const expectedState = {
                ...initialState,
                lists: {
                    [action.listId]: {
                        ...listProperties,
                        isLoading: true,
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });
    });

    describe('LIST_AFTER_FETCH', () => {
        it('items match', () => {
            const listId = 'listId';

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

            const listProperties: IList = {
                isLoading: true,
                isRemote: false,
                items,
            };

            const state = getStateWithLists({[listId]: listProperties});

            const expectedState = {
                ...state,
                lists: {
                    [listId]: {
                        ...listProperties,
                        ...action,
                        isFetched: true,
                        isLoading: false,
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });

        it('with list loadMore and action page', () => {
            const listId = 'listId';

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

            const listProperties: IList = {
                isLoading: true,
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

            const state = getStateWithLists({[listId]: listProperties});

            const expectedState = {
                ...state,
                lists: {
                    [listId]: {
                        ...listProperties,
                        ...action,
                        isFetched: true,
                        isLoading: false,
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
            const listId = 'listId';

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

            const listProperties: IList = {
                isLoading: true,
                isRemote: false,
            };

            const state = getStateWithLists({[listId]: listProperties});

            const expectedState = {
                ...state,
                lists: {
                    [listId]: {
                        ...listProperties,
                        ...action,
                        isLoading: false,
                        isFetched: true,
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });
    });

    describe('LIST_ITEM_ADD', () => {
        const listId = 'listId';
        const existingItem = {id: 'existingItem'};
        const payloadItem = {id: 'payloadItem'};

        const action = {
            type: LIST_ITEM_ADD,
            prepend: true,
            listId,
            item: payloadItem,
        };

        const listProperties: IList = {
            listId,
            formId: 'formId',
            items: [existingItem],
        };

        const state = getStateWithLists({[listId]: listProperties});

        const expectedState = {
            ...state,
            lists: {
                [listId]: {
                    ...listProperties,
                    items: [payloadItem, existingItem],
                },
            },
        };

        it('with prepend true', () => {
            expect(list(state, action)).toEqual(expectedState);
        });

        it('with prepend false', () => {
            action.prepend = false;
            expectedState.lists[listId].items = [existingItem, payloadItem];
            expect(list(state, action)).toEqual(expectedState);
        });
    });

    describe('LIST_ITEM_UPDATE', () => {
        const listId = 'listId';

        const getAction = (condition) => ({
            type: LIST_ITEM_UPDATE,
            condition,
            listId,
            item: {
                listId,
            },
        });

        const listProperties: IList = {
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
            [listId]: listProperties,
        });

        it('condition match', () => {
            const action = getAction({primaryKey: 'key'});

            const expectedState = {
                ...state,
                lists: {
                    [listId]: {
                        ...listProperties,
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
            const action = getAction({someProp: 'someProp'});
            const expectedResult = {...state};
            expect(list(state, action)).toEqual(expectedResult);
        });
    });

    describe('LIST_ITEM_DELETE', () => {
        it('default behavior', () => {
            const listId = 'listId';
            const matchCondition = {
                primaryKey: 'key',
            };

            const action = {
                type: LIST_ITEM_DELETE,
                listId,
                condition: matchCondition,
            };

            const listProperties: IList = {
                isLoading: false,
                items: [
                    matchCondition,
                ],
                loadMore: false,
            };

            const state = getStateWithLists({
                [listId]: listProperties,
            });

            const expectedState = {
                ...state,
                lists: {
                    [listId]: {
                        ...listProperties,
                        items: [],
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });
    });

    describe('LIST_DESTROY', () => {
        it('default behavior', () => {
            const listId = 'listId';

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
            };

            expect(list(state, action)).toEqual(expectedState);
        });
    });

    describe('LIST_TOGGLE_ITEM', () => {
        const itemId = 'itemId';
        const listId = 'listId';

        const action = {
            type: LIST_TOGGLE_ITEM,
            itemId,
            listId,
        };

        it('with not existing itemId', () => {
            const selectedIds = {
                [listId]: [],
            };

            const emptyListData = {};

            const state = getStateWithLists(emptyListData, selectedIds);

            const expectedState = {
                ...state,
                selectedIds: {
                    [listId]: [itemId],
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });

        it('with existing itemId', () => {
            const selectedIds = {
                [listId]: [itemId],
            };
            const emptyListData = {};

            const state = getStateWithLists(emptyListData, selectedIds);

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
        const listId = 'listId';
        const primaryKey = 'primaryKey';

        const action = {
            type: LIST_TOGGLE_ALL,
            listId,
        };

        it('should return empty array', () => {
            const lists = {
                existingList: {
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
            const itemId = 'itemId';

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
            const listId = 'listId';
            const layoutName = 'layoutName';

            const action = {
                type: LIST_SET_LAYOUT,
                listId,
                layoutName,
            };

            const listProperties = {
                items: [],
                formId: 'formId',
                listId,
            } as IList;

            const state = getStateWithLists({[listId]: listProperties});

            const expectedState = {
                ...state,
                lists: {
                    [listId]: {
                        ...listProperties,
                        layoutName,
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });
    });
});
