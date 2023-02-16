import {
    getSelectedIds,
    getIds,
    getList,
    getListItems,
    isSelected,
    isSelectedAll,
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
            lists: {...lists},
            ...extraData,
        },
    });

    beforeEach(() => {
        initialState = {...defaultInitialState};
    });

    describe('isListInitialized', () => {
        it('should return true', () => {
            const listId = 'listId';
            const state = getStateWithWrappedLists({[listId]: {}});
            const expectedIsListInitialized = true;
            expect(isListInitialized(state, listId)).toEqual(expectedIsListInitialized);
        });
    });

    describe('getList', () => {
        it('should return list', () => {
            const listId = 'listId';

            const listProperties = {
                formId: 'formId',
                isRemote: true,
                loadMore: true,
                primaryKey: 'key',
            };

            const lists = {[listId]: listProperties};
            const state = getStateWithWrappedLists(lists);
            expect(getList(state, listId)).toEqual(listProperties);
        });

        it('should return null', () => {
            const notExistingListId = 'notExistingListId';

            const lists = {
                existingList: {
                    formId: 'formId',
                    isRemote: true,
                    loadMore: true,
                    items: [],
                },
            };

            const state = getStateWithWrappedLists(lists);
            const emptyList = null;
            expect(getList(state, notExistingListId)).toEqual(emptyList);
        });
    });

    describe('getIds', () => {
        it('should return empty array', () => {
            const listId = 'listId';

            const lists = {
                [listId]: {
                    formId: 'formId',
                    isRemote: true,
                    loadMore: true,
                    items: [],
                },
            };

            const state = getStateWithWrappedLists(lists);
            const expectedEmptyIds = [];
            expect(getIds(state, listId)).toEqual(expectedEmptyIds);
        });

        it('should return items ids', () => {
            const listId = 'listId';
            const primaryKey = 'primaryKey';
            const itemId = 'itemId';

            const lists = {
                [listId]: {
                    formId: 'Form',
                    isRemote: true,
                    loadMore: true,
                    primaryKey,
                    items: [
                        {
                            [primaryKey]: itemId,
                        },
                    ],
                },
            };

            const state = getStateWithWrappedLists(lists);
            const expectedIds = [itemId];
            expect(getIds(state, listId)).toEqual(expectedIds);
        });
    });

    describe('getListItems', () => {
        const listId = 'listId';
        const primaryKey = 'primaryKey';

        const lists = {
            [listId]: {
                formId: 'formId',
                isRemote: true,
                loadMore: true,
                primaryKey,
            } as Record<string, any>,
        };

        it('should return empty items', () => {
            const state = getStateWithWrappedLists(lists);
            const emptyListItems = null;
            expect(getListItems(state, listId)).toEqual(emptyListItems);
        });

        it('should return items', () => {
            const items = [{[primaryKey]: 'itemId'}];
            lists[listId].items = items;
            const state = getStateWithWrappedLists(lists);
            expect(getListItems(state, listId)).toEqual(items);
        });
    });

    describe('getSelectedIds', () => {
        it('should return selectedIds', () => {
            const selectedIds = ['beautifulItemId', 'terribleItemId', 'shyItemId'];
            const listId = 'listId';

            const lists = {
                [listId]: {
                    formId: 'formId',
                    isRemote: true,
                    loadMore: true,
                },
            };

            const state = getStateWithWrappedLists(
                lists,
                {
                    selectedIds: {
                        [listId]: selectedIds,
                    },
                },
            );

            expect(getSelectedIds(state, listId)).toEqual(selectedIds);
        });

        it('should return empty array', () => {
            const notExistingListId = 'notExistingListId';
            const existingListId = 'existingListId';

            const lists = {
                [existingListId]: {
                    formId: 'formId',
                    isRemote: true,
                    loadMore: true,
                },
            };

            const state = getStateWithWrappedLists(
                lists,
                {
                    selectedIds:
                    {
                        [existingListId]: ['beautifulItemId'],
                    },
                },
            );

            const expectedEmptySelectedIds = [];
            expect(getSelectedIds(state, notExistingListId)).toEqual(expectedEmptySelectedIds);
        });
    });

    describe('isSelected', () => {
        it('default behavior', () => {
            const shyItemId = 'shyItemId';
            const selectedIds = ['terribleItemId', shyItemId];
            const listId = 'listId';

            const lists = {
                [listId]: {
                    formId: 'formId',
                    isRemote: true,
                    loadMore: true,
                },
            };

            const state = getStateWithWrappedLists(
                lists,
                {
                    selectedIds: {
                        [listId]: selectedIds,
                    },
                },
            );

            const expectedIsSelected = true;
            expect(isSelected(state, listId, shyItemId)).toBe(expectedIsSelected);
        });
    });

    describe('isSelectedAll', () => {
        it('should return true', () => {
            const itemId = 'itemId';
            const selectedIds = [itemId];
            const listId = 'listId';
            const primaryKey = 'primaryKey';

            const lists = {
                [listId]: {
                    formId: 'formId',
                    isRemote: true,
                    loadMore: true,
                    primaryKey,
                    items: [{[primaryKey]: itemId}],
                },
            };

            const state = getStateWithWrappedLists(
                lists,
                {
                    selectedIds: {
                        [listId]: selectedIds,
                    },
                },
            );

            const expectedIsSelectedAll = true;
            expect(isSelectedAll(state, listId)).toEqual(expectedIsSelectedAll);
        });
    });
});
