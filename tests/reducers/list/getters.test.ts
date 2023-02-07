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

    const getStateWithWrappedLists = (lists: TListCommonArg = null, extraData: TListCommonArg = null) => ({
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

            const litItem = {
                formId: 'formId',
                isRemote: true,
                loadMore: true,
                primaryKey: 'key',
            };

            const lists = {[listId]: litItem};
            const state = getStateWithWrappedLists(lists);
            expect(getList(state, listId)).toEqual(litItem);
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

    describe('getCheckedIds', () => {
        it('should return selectedIds', () => {
            const checkedIds = ['beautifulItemId', 'terribleItemId', 'shyItemId'];
            const listId = 'listId';

            const lists = {
                [listId]: {
                    formId: 'formId',
                    isRemote: true,
                    loadMore: true,
                },
            };

            const selectedIds = {[listId]: checkedIds};
            const state = getStateWithWrappedLists(lists, {selectedIds});
            expect(getCheckedIds(state, listId)).toEqual(checkedIds);
        });

        it('should return empty array', () => {
            const notExistingListId = 'notExistingListId';
            const existingListId = 'existingListId'

            const lists = {
                [existingListId]: {
                    formId: 'formId',
                    isRemote: true,
                    loadMore: true,
                },
            };

            const selectedIds = {[existingListId]: ['beautifulItemId']};
            const state = getStateWithWrappedLists(lists, {selectedIds});
            const expectedEmptyCheckedIds = [];
            expect(getCheckedIds(state, notExistingListId)).toEqual(expectedEmptyCheckedIds);
        });
    });

    describe('isChecked', () => {
        it('default behavior', () => {
            const shyItemId = 'shyItemId';
            const checkedIds = ['terribleItemId', shyItemId];
            const listId = 'listId';

            const lists = {
                [listId]: {
                    formId: 'formId',
                    isRemote: true,
                    loadMore: true,
                },
            };

            const selectedIds = {
                [listId]: checkedIds,
            };

            const state = getStateWithWrappedLists(lists, {selectedIds});
            expect(isChecked(state, listId, shyItemId)).toBe(true);
        });
    });

    describe('isCheckedAll', () => {
        it('should return true', () => {
            const itemId = 'itemId'
            const checkedIds = [itemId];
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

            const selectedIds = {[listId]: checkedIds};
            const state = getStateWithWrappedLists(lists, {selectedIds});
            expect(isCheckedAll(state, listId)).toEqual(true);
        });
    });
});
