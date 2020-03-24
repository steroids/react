import _get from 'lodash-es/get';
import {IListHocInput, IListHocPrivateProps} from '../hoc/list';

export const LIST_INIT = 'LIST_INIT';
export const LIST_BEFORE_FETCH = 'LIST_BEFORE_FETCH';
export const LIST_AFTER_FETCH = 'LIST_AFTER_FETCH';
export const LIST_ITEM_ADD = 'LIST_ITEM_ADD';
export const LIST_ITEM_UPDATE = 'LIST_ITEM_UPDATE';
export const LIST_DESTROY = 'LIST_DESTROY';
export const LIST_TOGGLE_ITEM = 'LIST_TOGGLE_ITEM';
export const LIST_TOGGLE_ALL = 'LIST_TOGGLE_ALL';
export const LIST_SET_LAYOUT = 'LIST_SET_LAYOUT';

const STORAGE_LAYOUT_KEY_PREFIX = 'listLayout_';

const lazyTimers = {};

const defaultFetchHandler = (list, http) => {
    let url = list.action;
    if (list.scope) {
        url +=
            (url.indexOf('?') !== -1 ? '&' : '?') + 'scope=' + list.scope.join(',');
    }
    return http
        .send(list.actionMethod, url || location.pathname, {
            ...list.query,
            page: list.page !== null ? list.page : undefined,
            pageSize: list.pageSize !== null ? list.pageSize : undefined,
            sort: list.sort
        })
        .then(response => response.data);
};

const createList = (listId, props: IListHocInput & IListHocPrivateProps, clientStorage) => ({
    action: props.action || props.action === '' ? props.action : null,
    actionMethod: props.actionMethod || 'post',
    onFetch: props.onFetch,
    scope: props.scope,
    page: props._pagination.enable ? props._pagination.defaultValue : null,
    pageSize: props._pagination.enable ? props._paginationSize.defaultValue : null,
    sort: props._sort.defaultValue || null,
    total: props.total || null,
    query: props.query || null,
    items: props.items || null,
    loadMore: props._pagination.loadMore,
    primaryKey: props.primaryKey,
    layoutName:
        clientStorage.get(STORAGE_LAYOUT_KEY_PREFIX + listId) ||
        // TODO props.selectedLayoutName ||
        _get(props, 'layout.items.0.id') ||
        null,
    listId,
    type: LIST_INIT
});

export const init = (listId, props) => (dispatch, getState, {clientStorage}) => dispatch({
    ...createList(listId, props, clientStorage),
    type: LIST_INIT
});

export const initSSR = (listId, props) => (dispatch, getState, {http, clientStorage}) => {
    const stateList = _get(getState(), ['list', 'lists', listId]);
    const list = {
        ...createList(listId, props, clientStorage),
        ...stateList
    };
    if ((!list.action && list.action !== '') || list.items) {
        if (!stateList) {
            return dispatch({
                ...list,
                type: LIST_INIT
            });
        }
        return;
    }
    const onFetch = list.onFetch || defaultFetchHandler;
    return dispatch(
        onFetch(list, http).then(data => ({
            ...list,
            ...data,
            type: LIST_INIT
        }))
    );
};

export const fetch = (listId, params = {}) => (dispatch, getState, {http}) => {
    const list = {
        ..._get(getState(), ['list', 'lists', listId]),
        ...params
    };
    if (!list.action && list.action !== '') {
        return;
    }
    const onFetch = list.onFetch || defaultFetchHandler;
    return dispatch([
        {
            ...params,
            listId,
            type: LIST_BEFORE_FETCH
        },
        onFetch(list, http).then(data => {
            if (!getState().list.lists[listId]) {
                return [];
            }
            return {
                ...data,
                listId,
                type: LIST_AFTER_FETCH
            };
        })
    ]);
};

export const lazyFetch = (listId, params) => dispatch => {
    if (lazyTimers[listId]) {
        clearTimeout(lazyTimers[listId]);
    }
    lazyTimers[listId] = setTimeout(() => dispatch(fetch(listId, params)), 200);
};

export const setPage = (listId, page, loadMore) =>
    fetch(listId, {
        page,
        loadMore
    });

export const setPageSize = (listId, pageSize) =>
    fetch(listId, {
        page: 1,
        pageSize
    });

export const setSort = (listId, sort) =>
    fetch(listId, {
        sort
    });
export const refresh = listId => fetch(listId);
export const add = (listId, item) => ({
    item,
    listId,
    type: LIST_ITEM_ADD
});
export const update = (listId, item, condition) => ({
    item,
    condition,
    listId,
    type: LIST_ITEM_UPDATE
});
export const destroy = listId => {
    if (lazyTimers[listId]) {
        clearTimeout(lazyTimers[listId]);
    }
    return {
        listId,
        type: LIST_DESTROY
    };
};
export const toggleItem = (listId, itemId) => ({
    listId,
    itemId,
    type: LIST_TOGGLE_ITEM
});
export const toggleAll = listId => ({
    listId,
    type: LIST_TOGGLE_ALL
});
export const setLayoutName = (listId, layoutName) => (
    dispatch,
    getState,
    {clientStorage}
) => {
    clientStorage.set(STORAGE_LAYOUT_KEY_PREFIX + listId, layoutName);
    return dispatch({
        listId,
        layoutName,
        type: LIST_SET_LAYOUT
    });
};
