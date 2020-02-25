import _get from 'lodash-es/get';

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
const defaultFetchHandler = list => (dispatch, getState, {http}) => {
    let url = list.action;
    if (list.scope) {
        url +=
            (url.indexOf('?') !== -1 ? '&' : '?') + 'scope=' + list.scope.join(',');
    }
    return dispatch(
        http
            .send(list.actionMethod, url || location.pathname, {
                ...list.query,
                page: list.page,
                pageSize: list.pageSize,
                sort: list.sort
            })
            .then(response => response.data)
    );
};
const createList = (listId, props, clientStorage) => ({
    action: props.action || props.action === '' ? props.action : null,
    actionMethod: props.actionMethod || 'post',
    onFetch: props.onFetch,
    scope: props.scope,
    page: props.defaultPage,
    pageSize: props.defaultPageSize,
    sort: props.defaultSort || null,
    total: props.total || null,
    query: props.query || null,
    items: props.items || null,
    loadMore: props.loadMore,
    primaryKey: props.primaryKey,
    layoutName:
        clientStorage.get(STORAGE_LAYOUT_KEY_PREFIX + listId) ||
        props.selectedLayoutName ||
        _get(props, 'layoutNames.0.id') ||
        null,
    listId,
    type: LIST_INIT
});
export const init = (listId, props) => (dispatch, getState, {clientStorage}) =>
    dispatch({
        ...createList(listId, props, clientStorage),
        type: LIST_INIT
    });
export const initSSR = (listId, props) => (dispatch, getState, {clientStorage}) => {
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
    return onFetch(list).then(data => {
        return dispatch({
            ...list,
            ...data,
            type: LIST_INIT
        });
    });
};
export const fetch = (listId, params = {}) => (dispatch, getState) => {
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
        onFetch(list).then(data => {
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
