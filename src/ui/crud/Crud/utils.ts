import _get from 'lodash-es/get';
import _isEmpty from 'lodash-es/isEmpty';
import {ICrudItem} from '../../../ui/crud/Crud/Crud';
import CrudDetail from '../../../ui/crud/Crud/CrudDetail';
import {getRouteId, getRouteParams, getRouteProp} from '../../../reducers/router';
import {getOpened} from '../../../reducers/modal';

export const DEFAULT_PRIMARY_KEY = 'id';
export const DEFAULT_QUERY_KEY = 'id';

export const CRUD_ACTION_INDEX = 'index';
export const CRUD_ACTION_CREATE = 'create';
export const CRUD_ACTION_UPDATE = 'update';
export const CRUD_ACTION_VIEW = 'view';
export const CRUD_ACTION_DELETE = 'delete';

export const pageControlsMap: Record<string, string[]> = {
    [CRUD_ACTION_INDEX]: [CRUD_ACTION_CREATE],
    [CRUD_ACTION_CREATE]: [CRUD_ACTION_INDEX],
    [CRUD_ACTION_UPDATE]: [CRUD_ACTION_INDEX, CRUD_ACTION_DELETE],
    [CRUD_ACTION_VIEW]: [CRUD_ACTION_INDEX, CRUD_ACTION_UPDATE, CRUD_ACTION_DELETE],
};

export const normalizeItems = (sourceItems: ICrudItem[] | {[key: string]: ICrudItem, }, fromProps): ICrudItem[] => {
    // Defaults
    const defaultItems: ({[key: string]: ICrudItem, }) = {
        index: {
            pkRequired: false,
        },
        create: {
            title: __('Добавление'),
            pkRequired: false,
        },
        update: {
            title: __('Редактирование'),
            controlsInclude: ['create', 'delete', 'view'],
        },
        view: {
            title: __('Просмотр'),
            component: CrudDetail,
            controlsInclude: ['update', 'delete'],
        },
        delete: {
            position: 'right',
            confirm: (e, props) => __('Удалить запись {id}?', {id: props.recordId}),
            onClick: async (e, props) => {
                if (props.restApi) {
                    props.goToAction(CRUD_ACTION_INDEX);
                    return;
                }

                if (props.restUrl) {
                    await props.components.http.delete(`${props.restUrl}/${props.recordId}`)
                        .then(() => props.goToAction(CRUD_ACTION_INDEX))
                        .catch((error) => {
                            if (props.errorHandler) {
                                props.errorHandler(error, props.components.store.dispatch);
                            } else {
                                throw error;
                            }
                        });
                    return;
                }

                throw new Error('Either restApi or restUrl must be set');
            },
        },
    };

    let items: Record<string, ICrudItem> = {};
    // Array -> Object
    if (Array.isArray(sourceItems)) {
        items = sourceItems.reduce((obj, item: ICrudItem) => {
            obj[item.id] = {
                ...item,
            };
            return obj;
        }, {});
    } else if (sourceItems) {
        items = sourceItems;
    }

    // Merge with defaults
    Object.keys(defaultItems).forEach(id => {
        items[id] = {
            id,
            ...defaultItems[id],
            ...items[id],
        };
        if (typeof fromProps[id] === 'object') {
            items[id] = {
                ...items[id],
                ...fromProps[id],
            };
        }
        if (typeof fromProps[id] === 'function') {
            items[id].component = fromProps[id];
        }
        if (fromProps[id] === false) {
            items[id].visible = false;
        }
    });

    // Object -> Array + defaults
    return Object.keys(items).map(id => ({
        id,
        actionName: id,
        pkRequired: true,
        ...items[id],
    }));
};

export const routeInfoSelector = (state, queryKey, mode = null) => {
    if (!queryKey) {
        queryKey = DEFAULT_QUERY_KEY;
    }

    const routeParams = getRouteParams(state);
    //const isModal = !!props.modalId;
    //let action = routeAction;
    //const crudItem = items.find(item => item.actionName === action);
    /*const mode = crudItem && crudItem.mode || props.mode || DEFAULT_MODE;
    if (mode === MODE_MODAL && !isModal) {
        action = CRUD_ACTION_INDEX;
        recordId = null;
    }*/

    return {
        routeId: getRouteId(state),
        routeTitle: getRouteProp(state, null, 'title') || getRouteProp(state, null, 'label'),
        routeAction: _get(routeParams, queryKey + 'Action') || _get(routeParams, queryKey) || CRUD_ACTION_INDEX,
        routeParams,
        //action,
        recordId: _get(routeParams, queryKey + 'Action') ? _get(routeParams, queryKey) : null,
        hasModal: !_isEmpty(getOpened(state)),
    };
};
