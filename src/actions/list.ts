import _get from 'lodash-es/get';
import _isArray from 'lodash-es/isArray';
import _isEmpty from 'lodash-es/isEmpty';
import _orderBy from 'lodash-es/orderBy';
import _trimStart from 'lodash-es/trimStart';
import _isFunction from 'lodash-es/isFunction';
import _isEqual from 'lodash-es/isEqual';
import _isNil from 'lodash-es/isNil';
import {formSelector} from '../reducers/form';
import {formChange, formSetErrors} from '../actions/form';
import {filterItems} from '../utils/data';

export interface IList {
    /**
    * Url, который вернет коллекцию элементов.
    * @example api/v1/articles
    */
    action?: string,

    /**
    * Тип HTTP запроса (GET | POST | PUT | DELETE)
    */
    actionMethod?: string,

    /**
    * Функция обратного вызова, вызываемая при получении списка.
    */
    onFetch?: (list: IList, query: Record<string, unknown>, components: any) => Promise<any>,

    /**
     * Обработчик события ошибки выполнения запроса
     * @param args
     */
    onError?: (error: Record<string, any>) => void;

    /**
    * Функция условия, используемая для определения поведения списка на основе параметров запроса.
    */
    condition?: (query: Record<string, unknown>) => any,

    /**
    * Массив строк, представляющих область списка.
    */
    scope?: string[],

    /**
    * Общее количество элементов в списке.
    */
    total?: number,

    /**
    * Массив элементов списка.
    */
    items?: Array<any>,

    /**
    * Массив исходных элементов списка.
    */
    sourceItems?: Array<any>,

    /**
    * Логическое значение, указывающее, является ли список удаленным или нет.
    */
    isRemote?: boolean,

    /**
    * Логическое значение, указывающее, можно ли загрузить еще элементы для списка.
    */
    loadMore?: boolean,

    /**
    * Первичный ключ для списка.
    */
    primaryKey?: string,

    /**
    * Идентификатор списка.
    */
    listId?: string,

    /**
    * Идентификатор формы, связанной с данным списком.
    */
    formId?: string,

    /**
    * Атрибут страницы для списка.
    */
    pageAttribute?: string,

    /**
    * Атрибут размера страницы для списка.
    */
    pageSizeAttribute?: string,

    /**
    * Атрибут сортировки для списка.
    */
    sortAttribute?: string,

    /**
    * Атрибут макета для списка.
    */
    layoutAttribute?: string,

    /**
    * Дополнительные метаданные для списка.
    */
    meta?: any,

    /**
    * Логическое значение, указывающее, был ли список получен или нет.
    */
    isFetched?: boolean,

    /**
    * Логическое значение, указывающее, находится ли список в процессе загрузки или нет.
    */
    isLoading?: boolean,

    /**
    * Название макета, связанного с данным списком.
    */
    layoutName?: null,
}

export const LIST_INIT = '@list/init';
export const LIST_SET_ITEMS = '@list/set_items';
export const LIST_BEFORE_FETCH = '@list/before_fetch';
export const LIST_AFTER_FETCH = '@list/after_fetch';
export const LIST_ITEM_ADD = '@list/item_add';
export const LIST_ITEM_UPDATE = '@list/item_update';
export const LIST_ITEM_DELETE = '@list/item_delete';
export const LIST_DESTROY = '@list/destroy';
export const LIST_TOGGLE_ITEM = '@list/toggle_item';
export const LIST_TOGGLE_ALL = '@list/toggle_all';
export const LIST_SET_LAYOUT = '@list/set_layout';

//const STORAGE_LAYOUT_KEY_PREFIX = 'listLayout_';

const lazyTimers = {};

const createList = (listId: string, props: any) => ({
    action: props.action || props.action === '' ? props.action : null,
    actionMethod: props.actionMethod || 'get',
    onFetch: props.onFetch,
    onError: props.onError,
    condition: props.condition,
    scope: props.scope,
    total: props.total || null,
    items: null,
    sourceItems: props.items || null,
    isRemote: !props.items,
    loadMore: props._pagination.loadMore,
    primaryKey: props.primaryKey,
    listId,
    formId: _get(props, 'searchForm.formId') || listId,
    pageAttribute: _get(props, '_pagination.attribute') || null,
    pageSizeAttribute: _get(props, '_paginationSize.attribute') || null,
    sortAttribute: _get(props, '_sort.attribute') || null,
    layoutAttribute: _get(props, '_layout.attribute') || null,
});

export const httpFetchHandler = (list: IList, query, {http}) => {
    let url = list.action;
    if (list.scope) {
        url
            += (url.indexOf('?') !== -1 ? '&' : '?') + 'scope=' + list.scope.join(',');
    }
    return http
        .send(list.actionMethod, url || window.location.pathname, query)
        .then(response => response.data)
        .catch(error => {
            if (typeof list.onError === 'function') {
                list.onError(error);
            }
        });
};

export const localFetchHandler = (list: IList, query: Record<string, unknown>) => {
    query = {...query};

    // Get page
    const page = parseInt(query[list.pageAttribute] as string, 10) || null;
    delete query[list.pageAttribute];

    // Get page size
    const pageSize = parseInt(query[list.pageSizeAttribute] as string, 10) || null;
    delete query[list.pageSizeAttribute];

    // Get sort
    const sort = query[list.sortAttribute] ? [].concat(query[list.sortAttribute]) : null;
    delete query[list.sortAttribute];

    // Delete layout param
    delete query[list.layoutAttribute];

    let items = [].concat(list.sourceItems || []);

    // Remove null or undefined values from query
    Object.keys(query).forEach(key => {
        if (_isNil(query[key])) {
            delete query[key];
        }
    });

    // Filter items
    if (!_isEmpty(query)) {
        items = filterItems(
            items,
            list.condition
                ? (_isFunction(list.condition) ? list.condition(query) : list.condition)
                : query,
        );
    }

    const total = items.length;

    // Pagination
    if (page && pageSize) {
        const startIndex = (page - 1) * pageSize;
        items = items.slice(startIndex, startIndex + pageSize);
    }

    // Sort
    if (sort) {
        items = _orderBy(
            items,
            sort.map(key => _trimStart(key, '-')),
            sort.map(key => key.indexOf('-') === 0 ? 'desc' : 'asc'),
        );
    }

    if (_isEqual(list.items, items)) {
        items = list.items;
    }

    return {
        items,
        total,
    };
};

/**
 * Init list
 * @param listId
 * @param payload
 */
export const listInit = (listId, payload) => ({
    type: LIST_INIT,
    payload,
});

export const listSetItems = (listId, items) => ({
    type: LIST_SET_ITEMS,
    listId,
    items,
});

export const listSetLayout = (listId, layoutName) => ({
    type: LIST_SET_LAYOUT,
    listId,
    layoutName,
});

/*export const initSSR = (listId, props) => (dispatch, getState, {http, clientStorage}) => {
    const state = getState()
    const stateList = _get(state, ['list', 'lists', listId]);
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
    const onFetch = list.onFetch || httpFetchHandler;
    return dispatch(
        onFetch(list, VALUES, http).then(data => ({
            ...list,
            ...data,
            type: LIST_INIT
        }))
    );
};*/

/**
 * Update query values and send request
 * @param listId
 * @param query
 */
export const listFetch = (listId: string, query: any = {}) => (dispatch, getState, components) => {
    const state = getState();

    const list = _get(state, ['list', 'lists', listId]) as IList;

    if (!list || (list.isRemote && !list.action && list.action !== '')) {
        return [];
    }

    const toDispatch = [];
    const formValues = formSelector(state, list.formId, ({values}) => values) || {};
    const onFetch = list.onFetch || (list.isRemote ? httpFetchHandler : localFetchHandler);

    // Change query
    Object.keys(query || {}).forEach(key => {
        formValues[key] = query[key];
        toDispatch.push(formChange(list.formId, key, query[key]));
    });

    if (list.isRemote) {
        // Set `Loading...`
        toDispatch.push({
            listId,
            type: LIST_BEFORE_FETCH,
        });
    }

    // Send request
    toDispatch.push(
        Promise.resolve(onFetch(list, formValues, components)).then(data => {
            // Skip on empty
            if (!data) {
                return [];
            }

            // Check list is not destroy
            if (!getState().list.lists[listId]) {
                return [];
            }

            if (_isArray(data)) {
                data = {
                    items: data,
                    total: data.length,
                    meta: null,
                };
            }

            return [
                // Check has errors
                formSetErrors(list.formId, data.errors || null),
                {
                    items: data.items || [],
                    total: data.total || null,
                    meta: data.meta || null,
                    page: formValues[list.pageAttribute],
                    pageSize: formValues[list.pageSizeAttribute],
                    listId,
                    type: LIST_AFTER_FETCH,
                },
            ];
        }),
    );

    return dispatch(toDispatch);
};

/**
 * Lazy update query values and send request
 * @param listId
 * @param query
 */
export const listLazyFetch = (listId: string, query: any = {}) => dispatch => {
    if (lazyTimers[listId]) {
        clearTimeout(lazyTimers[listId]);
    }
    lazyTimers[listId] = setTimeout(() => dispatch(listFetch(listId, query)), 200);
};

/**
 * Send request with same query
 * @param listId
 */
export const listRefresh = (listId: string) => listFetch(listId);

/**
 * Destroy list (remove from redux state)
 * @param listId
 */
export const listDestroy = (listId: string) => {
    if (lazyTimers[listId]) {
        clearTimeout(lazyTimers[listId]);
    }
    return {
        listId,
        type: LIST_DESTROY,
    };
};

export const add = (listId, item, prepend = false) => ({
    item,
    prepend,
    listId,
    type: LIST_ITEM_ADD,
});
export const update = (listId, item, condition) => ({
    item,
    condition,
    listId,
    type: LIST_ITEM_UPDATE,
});
export const deleteItem = (listId, condition) => ({
    condition,
    listId,
    type: LIST_ITEM_DELETE,
});
export const toggleItem = (listId, itemId) => ({
    listId,
    itemId,
    type: LIST_TOGGLE_ITEM,
});
export const toggleAll = listId => ({
    listId,
    type: LIST_TOGGLE_ALL,
});

// TODO local storage save?
/*export const setLayoutName = (listId, layoutName) => (
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
*/
