import {
    getCheckedIds,
    getIds,
    getList,
    getListItems,
    isChecked,
    isCheckedAll,
    isListInitialized,
} from '../../../src/reducers/list';

type TListCommonArg = Record<string, any> | null;

describe('list reducers', () => {
    const defaultInitialState = {
        lists: {},
        selectedIds: {},
    };

    let initialState = {...defaultInitialState};

    const getStateWithWrappedLists = (
        lists: TListCommonArg = null,
        extraData: TListCommonArg = null,
    ) => ({
        list: {
            ...initialState,
            lists: {
                ...lists,
            },
            ...extraData,
        },
    });

    beforeEach(() => {
        initialState = {...defaultInitialState};
    });

    describe('isListInitialized', () => {
        it('should return true', () => {
            const listId = '10';
            const state = getStateWithWrappedLists({[listId]: {}});
            const expectedIsListInitialized = true;

            expect(isListInitialized(state, listId)).toEqual(
                expectedIsListInitialized,
            );
        });
    });

    describe('getList', () => {
        it('should return list', () => {
            const listId = '10';

            const litItem = {
                formId: '1',
                isRemote: true,
                loadMore: true,
                primaryKey: 'key',
            };

            const lists = {
                [listId]: litItem,
            };

            const state = getStateWithWrappedLists(lists);
            expect(getList(state, listId)).toEqual(litItem);
        });

        it('should return null', () => {
            const listId = '11';

            const lists = {
                10: {
                    formId: '1',
                    isRemote: true,
                    loadMore: true,
                    items: [],
                },
            };

            const state = getStateWithWrappedLists(lists);
            const emptyList = null;
            expect(getList(state, listId)).toEqual(emptyList);
        });
    });

    describe('getIds', () => {
        it('should return empty array', () => {
            const listId = '10';

            const lists = {
                [listId]: {
                    formId: '1',
                    isRemote: true,
                    loadMore: true,
                    items: [],
                },
            };

            const state = getStateWithWrappedLists(lists);
            const expectedEmptyIds = [];
            expect(getIds(state, listId)).toEqual(expectedEmptyIds);
        });

        it('should return ids', () => {
            const listId = '10';
            const primaryKey = 'key';

            const lists = {
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
            };

            const state = getStateWithWrappedLists(lists);
            const expectedIds = ['item1'];
            expect(getIds(state, listId)).toEqual(expectedIds);
        });
    });

    describe('getListItems', () => {
        it('should return items', () => {
            const listId = '12';
            const primaryKey = 'key';

            const lists = {
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
            };

            const state = getStateWithWrappedLists(lists);
            const expectedListItems = [...lists[listId].items];
            expect(getListItems(state, listId)).toEqual(expectedListItems);
        });

        it('should return null', () => {
            const listId = '12';
            const primaryKey = 'key';

            const lists = {
                [listId]: {
                    formId: '1',
                    isRemote: true,
                    loadMore: true,
                    primaryKey,
                },
            };

            const state = getStateWithWrappedLists(lists);
            const emptyListItems = null;
            expect(getListItems(state, listId)).toEqual(emptyListItems);
        });
    });

    describe('getCheckedIds', () => {
        it('should return selectedIds', () => {
            const checkedIds = ['1', '3', '5'];
            const listId = '12';

            const lists = {
                [listId]: {
                    formId: '1',
                    isRemote: true,
                    loadMore: true,
                },
            };

            const selectedIds = {
                [listId]: checkedIds,
            };

            const state = getStateWithWrappedLists(lists, {selectedIds});
            expect(getCheckedIds(state, listId)).toEqual(checkedIds);
        });

        it('should return empty array', () => {
            const listId = '13';

            const lists = {
                10: {
                    formId: '1',
                    isRemote: true,
                    loadMore: true,
                },
            };

            const selectedIds = {
                10: ['1', '3', '5'],
            };

            const state = getStateWithWrappedLists(lists, {selectedIds});
            const expectedEmptyCheckedIds = [];

            expect(getCheckedIds(state, listId)).toEqual(
                expectedEmptyCheckedIds,
            );
        });
    });

    describe('isChecked', () => {
        it('default behavior', () => {
            const itemId = '3';
            const checkedIds = ['1', itemId, '5'];
            const listId = '12';

            const lists = {
                [listId]: {
                    formId: '1',
                    isRemote: true,
                    loadMore: true,
                },
            };

            const selectedIds = {
                [listId]: checkedIds,
            };

            const state = getStateWithWrappedLists(lists, {selectedIds});
            const expectedIsChecked = true;
            expect(isChecked(state, listId, itemId)).toEqual(expectedIsChecked);
        });
    });

    describe('isCheckedAll', () => {
        it('should return true', () => {
            const checkedIds = ['item1'];
            const listId = '12';
            const primaryKey = 'key';

            const lists = {
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
            };

            const selectedIds = {
                [listId]: checkedIds,
            };

            const state = getStateWithWrappedLists(lists, {selectedIds});
            const expectedIsCheckedAll = true;
            expect(isCheckedAll(state, listId)).toEqual(expectedIsCheckedAll);
        });
    });
});
