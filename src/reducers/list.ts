import _get from 'lodash-es/get';
import _isMatch from 'lodash-es/isMatch';
import _every from 'lodash-es/every';
import _extend from 'lodash-es/extend';
import {
    LIST_INIT,
    LIST_SET_ITEMS,
    LIST_BEFORE_FETCH,
    LIST_AFTER_FETCH,
    LIST_ITEM_ADD,
    LIST_ITEM_UPDATE,
    LIST_DESTROY,
    LIST_TOGGLE_ITEM,
    LIST_TOGGLE_ALL,
    LIST_SET_LAYOUT,
    LIST_ITEM_DELETE,
    LIST_SELECTED_IDS_DESTROY,
} from '../actions/list';

const initialState = {
    lists: {},
    selectedIds: {},
};

const reducerMap = {
    [LIST_INIT]: (state, action) => ({
        ...state,
        lists: {
            ...state.lists,
            [action.payload.listId]: {
                meta: {},
                total: action.payload.total || (action.payload.items ? action.payload.items.length : 0),
                isFetched: !!action.payload.items,
                isLoading: false,
                ...action.payload,
            },
        },
    }),
    [LIST_SET_ITEMS]: (state, action) => ({
        ...state,
        lists: {
            ...state.lists,
            [action.listId]: {
                ...state.lists[action.listId],
                items: action.items,
            },
        },
    }),
    [LIST_BEFORE_FETCH]: (state, action) => ({
        ...state,
        lists: {
            ...state.lists,
            [action.listId]: {
                ...state.lists[action.listId],
                isLoading: true,
            },
        },
    }),
    [LIST_AFTER_FETCH]: (state, action) => {
        let items;
        const list = state.lists[action.listId];
        if (list.items === action.items) {
            // No changes
            items = list.items;
        } else if (list && list.items && list.loadMore && action.page > 1) {
            items = [].concat(list.items);
            action.items.forEach((entry, i) => {
                const index = (action.page - 1) * action.pageSize + i;
                items[index] = entry;
            });
        } else {
            items = [].concat(action.items);
        }
        return {
            ...state,
            lists: {
                ...state.lists,
                [action.listId]: {
                    ...list,
                    ...action,
                    items,
                    isFetched: true,
                    isLoading: false,
                },
            },
        };
    },
    [LIST_ITEM_ADD]: (state, action) => {
        if (state.lists[action.listId]) {
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [action.listId]: {
                        ...state.lists[action.listId],
                        items: action.prepend
                            ? []
                                .concat(action.item)
                                .concat(state.lists[action.listId].items)
                            : []
                                .concat(state.lists[action.listId].items)
                                .concat(action.item),
                    },
                },
            };
        }
        return [];
    },
    [LIST_ITEM_UPDATE]: (state, action) => ({
        ...state,
        lists: {
            ...state.lists,
            [action.listId]: {
                ...state.lists[action.listId],
                items: state.lists[action.listId].items.map(item => {
                    if (_isMatch(item, action.condition)) {
                        item = _extend({}, item, action.item);
                    }
                    return item;
                }),
            },
        },
    }),
    [LIST_ITEM_DELETE]: (state, action) => ({
        ...state,
        lists: {
            ...state.lists,
            [action.listId]: {
                ...state.lists[action.listId],
                items: state.lists[action.listId].items.filter(
                    item => !_isMatch(item, action.condition),
                ),
            },
        },
    }),
    [LIST_DESTROY]: (state, action) => {
        delete state.lists[action.listId];
        return {
            ...state,
            lists: {
                ...state.lists,
            },
        };
    },
    [LIST_TOGGLE_ITEM]: (state, action) => {
        let selectedIds = _get(state, ['selectedIds', action.listId]) || [];
        const index = selectedIds.indexOf(action.itemId);
        if (index === -1) {
            selectedIds = [...selectedIds, action.itemId];
        } else {
            selectedIds = selectedIds.filter(selectedId => selectedId !== action.itemId);
        }
        return {
            ...state,
            selectedIds: {
                ...state.selectedIds,
                [action.listId]: [].concat(selectedIds),
            },
        };
    },
    [LIST_TOGGLE_ALL]: (state, action) => {
        const list = state.lists[action.listId];
        if (list) {
            const ids = list.items.map(item => item[list.primaryKey]) || [];
            const isAll = state.selectedIds[action.listId]
                && _every(ids.map(id => state.selectedIds[action.listId].includes(id)));
            return {
                ...state,
                selectedIds: {
                    ...state.selectedIds,
                    [action.listId]: isAll ? [] : ids,
                },
            };
        }
        return [];
    },
    [LIST_SELECTED_IDS_DESTROY]: (state, action) => {
        delete state.selectedIds[action.listId];
        return {
            ...state,
            selectedIds: {
                ...state.selectedIds,
            },
        };
    },
    [LIST_SET_LAYOUT]: (state, action) => ({
        ...state,
        lists: {
            ...state.lists,
            [action.listId]: {
                ...state.lists[action.listId],
                layoutName: action.layoutName,
            },
        },
    }),
};

export default (state = initialState, action) => reducerMap[action.type]
    ? reducerMap[action.type](state, action)
    : state;

export const isListInitialized = (state, listId) => !!_get(state, ['list', 'lists', listId]);
export const getList = (state, listId) => _get(state, ['list', 'lists', listId]) || null;
export const getIds = (state, listId) => {
    const list = getList(state, listId);
    return (
        (list && list.items && list.items.map(item => item[list.primaryKey])) || []
    );
};
export const getListItems = (state, listId) => _get(state, ['list', 'lists', listId, 'items']) || null;
export const getSelectedIds = (state, listId) => _get(state, ['list', 'selectedIds', listId]) || [];
export const isSelected = (state, listId, itemId) => getSelectedIds(state, listId).includes(itemId);
export const isSelectedAll = (state, listId) => {
    const selectedIds = getSelectedIds(state, listId);
    return (
        selectedIds.length > 0
        && _every(getIds(state, listId).map(id => selectedIds.includes(id)))
    );
};

// deprecated
export const getCheckedIds = (state, listId) => _get(state, ['list', 'selectedIds', listId]) || [];
