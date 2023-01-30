import {
    IList,
    LIST_BEFORE_FETCH,
    LIST_DESTROY,
    LIST_INIT,
    LIST_SET_ITEMS,
} from '../../src/actions/list';
import list, {
    getCheckedIds,
    getIds,
    getList,
    getListItems,
    isChecked,
    isCheckedAll,
    isListInitialized,
} from '../../src/reducers/list';

describe('list reducers', () => {
    const defaultInitialState = {
        lists: {},
        selectedIds: {},
    };

    let initialState = {...defaultInitialState};

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

            const state = {
                ...initialState,
                lists: {
                    2: {
                        items: [],
                    },
                },
            };

            const expectedState = {
                ...initialState,
                lists: {
                    2: {...state.lists[2]},
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

            const state = {
                ...initialState,
                lists: {
                    2: {
                        items: [],
                    },
                },
            };

            const expectedState = {
                ...initialState,
                lists: {
                    2: {...state.lists[2]},
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

            const state = {
                ...initialState,
                lists: {
                    2: {
                        items: [],
                    },
                    [listId]: {
                        isLoading: true,
                    } as IList,
                },
            };

            const expectedState = {
                ...initialState,
                lists: {
                    ...state.lists,
                    [listId]: {
                        ...state.lists[action.listId],
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

            const state = {
                ...initialState,
                lists: {
                    [listId]: {
                        isLoading: false,
                        isRemote: false,
                    } as IList,
                },
            };

            const expectedState = {
                ...initialState,
                lists: {
                    [action.listId]: {
                        ...state.lists[action.listId],
                        isLoading: true,
                    },
                },
            };

            expect(list(state, action)).toEqual(expectedState);
        });
    });

    //TODO LIST_AFTER_FETCH, LIST_ITEM_ADD, LIST_ITEM_UPDATE, LIST_ITEM_DELETE, LIST_TOGGLE_ITEM,
    describe('LIST_DESTROY', () => {
        it('default behavior', () => {
            const listId = '10';
            const action = {
                type: LIST_DESTROY,
                listId,
            };

            const state = {
                ...initialState,
                lists: {
                    [listId]: {
                        isFetched: true,
                        items: [],
                        isLoading: false,
                    },
                } as Record<string, IList>,
            };

            const expectedState = {
                ...initialState,
                lists: {},
            };

            expect(list(state, action)).toEqual(expectedState);
        });
    });

    //TODO LIST_TOGGLE_ALL, LIST_SET_LAYOUT

    describe('isListInitialized', () => {
        it('should return true', () => {
            const listId = '10';

            const globalState = {
                list: {
                    ...initialState,
                    lists: {
                        [listId]: {},
                    },
                },
            };

            const expectedResult = true;

            expect(isListInitialized(globalState, listId)).toEqual(
                expectedResult,
            );
        });
    });

    describe('getList', () => {
        it('should return list', () => {
            const listId = '10';

            const globalState = {
                list: {
                    ...initialState,
                    lists: {
                        [listId]: {
                            formId: '1',
                            isRemote: true,
                            loadMore: true,
                            primaryKey: 'key',
                        },
                    },
                },
            };

            const expectedResult = {
                ...globalState.list.lists[listId],
            };

            expect(getList(globalState, listId)).toEqual(expectedResult);
        });

        it('should return null', () => {
            const listId = '11';

            const globalState = {
                list: {
                    ...initialState,
                    lists: {
                        10: {
                            formId: '1',
                            isRemote: true,
                            loadMore: true,
                            items: [],
                        },
                    },
                },
            };

            const expectedResult = null;

            expect(getList(globalState, listId)).toEqual(expectedResult);
        });
    });

    describe('getIds', () => {
        it('should return empty array', () => {
            const listId = '10';

            const globalState = {
                list: {
                    ...initialState,
                    lists: {
                        [listId]: {
                            formId: '1',
                            isRemote: true,
                            loadMore: true,
                            items: [],
                        },
                    },
                },
            };

            const expectedResult = [];

            expect(getIds(globalState, listId)).toEqual(expectedResult);
        });

        it('should return ids', () => {
            const listId = '10';
            const primaryKey = 'key';

            const globalState = {
                list: {
                    ...initialState,
                    lists: {
                        [listId]: {
                            formId: '1',
                            isRemote: true,
                            loadMore: true,
                            primaryKey,
                            items: [
                                {
                                    [primaryKey]: 'item1',
                                },
                            ],
                        },
                    },
                },
            };

            const expectedResult = ['item1'];

            expect(getIds(globalState, listId)).toEqual(expectedResult);
        });
    });

    describe('getListItems', () => {
        it('should return items', () => {
            const listId = '12';
            const primaryKey = 'key';

            const globalState = {
                list: {
                    ...initialState,
                    lists: {
                        [listId]: {
                            formId: '1',
                            isRemote: true,
                            loadMore: true,
                            primaryKey,
                            items: [
                                {
                                    [primaryKey]: 'item1',
                                },
                            ],
                        },
                    },
                },
            };

            const expectedResult = [...globalState.list.lists[listId].items];

            expect(getListItems(globalState, listId)).toEqual(expectedResult);
        });

        it('should return null', () => {
            const listId = '12';
            const primaryKey = 'key';

            const globalState = {
                list: {
                    ...initialState,
                    lists: {
                        [listId]: {
                            formId: '1',
                            isRemote: true,
                            loadMore: true,
                            primaryKey,
                        },
                    },
                },
            };

            const expectedResult = null;

            expect(getListItems(globalState, listId)).toEqual(expectedResult);
        });
    });

    describe('getCheckedIds', () => {
        it('should return selectedIds', () => {
            const checkedIds = ['1', '3', '5'];
            const listId = '12';

            const globalState = {
                list: {
                    ...initialState,
                    lists: {
                        [listId]: {
                            formId: '1',
                            isRemote: true,
                            loadMore: true,
                        },
                    },
                    selectedIds: {
                        [listId]: checkedIds,
                    },
                },
            };

            const expectedResult = checkedIds;

            expect(getCheckedIds(globalState, listId)).toEqual(expectedResult);
        });

        it('should return empty array', () => {
            const listId = '13';

            const globalState = {
                list: {
                    ...initialState,
                    lists: {
                        10: {
                            formId: '1',
                            isRemote: true,
                            loadMore: true,
                        },
                    },
                    selectedIds: {
                        10: ['1', '3', '5'],
                    },
                },
            };

            const expectedResult = [];

            expect(getCheckedIds(globalState, listId)).toEqual(expectedResult);
        });
    });

    describe('isChecked', () => {
        it('default behavior', () => {
            const itemId = '3';
            const checkedIds = ['1', itemId, '5'];
            const listId = '12';

            const globalState = {
                list: {
                    ...initialState,
                    lists: {
                        [listId]: {
                            formId: '1',
                            isRemote: true,
                            loadMore: true,
                        },
                    },
                    selectedIds: {
                        [listId]: checkedIds,
                    },
                },
            };

            const expectedResult = true;

            expect(isChecked(globalState, listId, itemId)).toEqual(
                expectedResult,
            );
        });
    });

    describe('isCheckedAll', () => {
        it('should return true', () => {
            const checkedIds = ['item1'];
            const listId = '12';
            const primaryKey = 'key';

            const globalState = {
                list: {
                    ...initialState,
                    lists: {
                        [listId]: {
                            formId: '1',
                            isRemote: true,
                            loadMore: true,
                            primaryKey,
                            items: [
                                {
                                    [primaryKey]: 'item1',
                                },
                            ],
                        },
                    },
                    selectedIds: {
                        [listId]: checkedIds,
                    },
                },
            };

            const expectedResult = true;

            expect(isCheckedAll(globalState, listId)).toEqual(expectedResult);
        });
    });
});
