import _get from 'lodash-es/get';
import _isMatch from 'lodash-es/isMatch';
import _every from 'lodash-es/every';
import _extend from 'lodash-es/extend';

import {
    LIST_INIT,
    LIST_BEFORE_FETCH,
    LIST_AFTER_FETCH,
    LIST_ITEM_ADD,
    LIST_ITEM_UPDATE,
    LIST_DESTROY,
    LIST_TOGGLE_ITEM,
    LIST_TOGGLE_ALL,
    LIST_SET_LAYOUT,
} from '../actions/list';

const initialState = {
    lists: {},
    selectedIds: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LIST_INIT:
            const {type, ...payload} = action; // eslint-disable-line no-unused-vars
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [action.listId]: {
                        meta: {},
                        layoutName: null,
                        total: action.total || (action.items ? action.items.length : 0),
                        isFetched: !!action.items,
                        isLoading: false,
                        ...payload,
                    },
                },
            };

        case LIST_BEFORE_FETCH:
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [action.listId]: {
                        ...state.lists[action.listId],
                        ...action,
                        isLoading: true,
                    }
                }
            };

        case LIST_AFTER_FETCH:
            let items;
            const list = state.lists[action.listId];

            if (list && list.items && list.loadMore && list.page > 1) {
                items = [].concat(list.items);
                action.items.forEach((entry, i) => {
                    const index = ((list.page - 1) * list.pageSize) + i;
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
                    }
                }
            };

        case LIST_ITEM_ADD:
            if (state.lists[action.listId]) {
                return {
                    ...state,
                    lists: {
                        ...state.lists,
                        [action.listId]: {
                            ...state.lists[action.listId],
                            items: action.prepend
                                ? [].concat(action.item).concat(state.lists[action.listId].items)
                                : [].concat(state.lists[action.listId].items).concat(action.item),
                        }
                    }
                };
            }
            break;

        case LIST_ITEM_UPDATE:
            return {
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
                    }
                }
            };

        case LIST_DESTROY:
            delete state.lists[action.listId];
            return {
                ...state,
                lists: {
                    ...state.lists,
                }
            };

        case LIST_TOGGLE_ITEM:
            const selectedIds = _get(state, ['selectedIds', action.listId]) || [];
            const index = selectedIds.indexOf(action.itemId);
            if (index === -1) {
                selectedIds.push(action.itemId);
            } else {
                selectedIds.splice(index, 1);
            }
            return {
                ...state,
                selectedIds: {
                    ...state.selectedIds,
                    [action.listId]: [].concat(selectedIds),
                },
            };

        case LIST_TOGGLE_ALL:
            const list4 = state.lists[action.listId];
            if (list4) {
                const ids = list4.items.map(item => item[list4.primaryKey]) || [];
                const isAll = state.selectedIds[action.listId] && _every(ids.map(id => state.selectedIds[action.listId].includes(id)));
                return {
                    ...state,
                    selectedIds: {
                        ...state.selectedIds,
                        [action.listId]: isAll ? [] : ids,
                    },
                };
            }
            break;

        case LIST_SET_LAYOUT:
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [action.listId]: {
                        ...state.lists[action.listId],
                        layoutName: action.layoutName,
                    }
                }
            };
    }

    return state;
};

export const getList = (state, listId) => _get(state, ['list', 'lists', listId]) || null;
export const getIds = (state, listId) => {
    const list = getList(state, listId);
    return list && list.items && list.items.map(item => item[list.primaryKey]) || [];
};
export const getCheckedIds = (state, listId) => {
    return _get(state, ['list', 'selectedIds', listId]) || [];
};
export const isChecked = (state, listId, itemId) => getCheckedIds(state, listId).includes(itemId);
export const isCheckedAll = (state, listId) => {
    const selectedIds = getCheckedIds(state, listId);
    return selectedIds.length > 0 && _every(getIds(state, listId).map(id => selectedIds.includes(id)));
};
