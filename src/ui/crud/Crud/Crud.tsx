import * as React from 'react';
import _get from 'lodash-es/get';
import _isString from 'lodash-es/isString';
import _isEmpty from 'lodash-es/isEmpty';
import _omit from 'lodash-es/omit';
import {getRouteId, getRouteParams, getRouteProp} from '../../../reducers/router';
import {goToRoute} from '../../../actions/router';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IConnectHocOutput} from '../../../hoc/connect';
import {IFormProps} from '../../form/Form/Form';
import {IGridProps} from '../../list/Grid/Grid';
import CrudGrid from './CrudGrid';
import {IControlItem} from '../../nav/Controls/Controls';
//TODO import {IDetailProps} from '../../list/Detail/Detail';
import CrudForm from './CrudForm';
import CrudDetail from './CrudDetail';
import {closeModal, openModal} from '../../../actions/modal';
import Modal from '../../modal/Modal';
import {getOpened} from '../../../reducers/modal';
import {listRefresh} from '../../../actions/list';
import {ReactNode, useCallback, useEffect, useMemo} from 'react';
import {useComponents, useSelector} from '@steroidsjs/core/hooks';
import useFetch from '@steroidsjs/core/hooks/useFetch';
import {usePrevious} from 'react-use';
import useDispatch from '@steroidsjs/core/hooks/useDispatch';

export interface ICrudItem extends Omit<IControlItem, 'visible' | 'confirm' | 'onClick'> {
    title?: string,
    actionName?: string,
    pkRequired?: boolean,
    mode?: 'page' | 'modal',
    component?: any,
    componentProps?: any,
    controlsInclude?: string[],
    controlsExclude?: string[],
    visible?: boolean | ((item: any, crudItem: ICrudItem, isGrid: boolean) => boolean),
    confirm?: string | ((e: any, itemId: PrimaryKey, item: any, props: ICrudClickProps) => any),
    onClick?: (e: Event | React.MouseEvent, itemId: PrimaryKey, item: any, props: ICrudClickProps) => any,
}

export interface ICrudClickProps extends ICrudProps, IConnectHocOutput, IComponentsHocOutput {
    routeId?: string,
    routeParams?: any,
    item?: any,
    itemId?: PrimaryKey,
    action?: string,
}

export interface ICrudProps {
    crudId?: string;
    mode?: 'page' | 'modal',
    restUrl?: string | ((props: ICrudClickProps) => string),
    primaryKey?: 'id' | string,
    queryKey?: 'id' | string,
    model?: string,
    searchModel?: string,
    index?: boolean | ICrudItem,
    create?: boolean | ICrudItem,
    update?: boolean | ICrudItem,
    view?: boolean | ICrudItem,
    delete?: boolean | ICrudItem,
    items?: ICrudItem[] | { [key: string]: ICrudItem };
    grid?: IGridProps | ((props: ICrudClickProps) => IGridProps),
    gridComponent?: any,
    form?: IFormProps | ((props: ICrudClickProps) => IFormProps),
    formComponent?: any,
    detail?: any, //TODO IDetailProps,
    detailComponent?: any,
    [key: string]: any,
}

export interface ICrudChildrenProps extends ICrudProps, IConnectHocOutput, IComponentsHocOutput {
    item?: any,
    itemId?: PrimaryKey,
    action?: string,
    routeId?: string,
    controlsGetter?: any,
    restUrl?: string,
    onComplete?: () => void,
    form?: IFormProps,
    grid?: IGridProps,
}

const MODE_PAGE = 'page';
const MODE_MODAL = 'modal';

export const DEFAULT_PRIMARY_KEY = 'id';
export const DEFAULT_QUERY_KEY = 'id';
export const DEFAULT_MODE = MODE_PAGE;
export const CRUD_ACTION_INDEX = 'index';

export interface ICrudViewProps {
    className?: CssClassName,
    controls?: IControlItem[],
    title?: string,
    children?: ReactNode,
}

export const getCrudId = (props: ICrudProps) => props.crudId || props.routeId;
export const getCrudModalId = (props: ICrudProps) => getCrudId(props);
export const getCrudGridId = (props: ICrudProps) => getCrudId(props);
export const getCrudFormId = (
    props: ICrudProps,
    suffix = null
) => [getCrudId(props), props.itemId, suffix].filter(Boolean).join('_');

const defaultItems: ({ [key: string]: ICrudItem }) = {
    index: {
        component: CrudGrid,
        pkRequired: false,
    },
    create: {
        title: __('Добавление'),
        component: CrudForm,
        pkRequired: false,
    },
    update: {
        title: __('Редактирование'),
        component: CrudForm,
        controlsInclude: ['create', 'delete', 'view'],
    },
    view: {
        title: __('Просмотр'),
        component: CrudDetail,
        controlsInclude: ['update', 'delete'],
    },
    delete: {
        position: 'right',
        confirm: (e, id) => __('Удалить запись {id}?', {id}),
        onClick: async (e, itemId, item, props: ICrudClickProps) => {
            const restUrl = typeof props.restUrl === 'function' ? props.restUrl(props) : props.restUrl;
            await props.http.delete(`${restUrl}/${itemId}`);

            if (props.action === CRUD_ACTION_INDEX) {
                props.dispatch(listRefresh(getCrudGridId(props)));
            } else {
                props.dispatch(goToRoute(props.routeId, {
                    ...props.routeParams,
                    [props.queryKey]: null,
                    [props.queryKey + 'Action']: null,
                }));
            }
        },
    },
};

const resolveVisible = (
    currentCrudItem: ICrudItem,
    crudItem: ICrudItem,
    itemId: PrimaryKey,
    isGrid: boolean,
    hasModal: boolean
) => {
    // Force disable visible
    if (crudItem.visible === false) {
        return false;
    }

    // No render control on self page
    if (currentCrudItem.actionName === crudItem.actionName) {
        return false;
    }

    // Grid render only "pkRequired" actions
    if (isGrid) {
        return !!crudItem.pkRequired;
    }

    // Always show index action in page mode
    if (crudItem.actionName === CRUD_ACTION_INDEX) {
        return !hasModal;
    }

    // Check includes
    if (currentCrudItem.controlsInclude && !currentCrudItem.controlsInclude.includes(crudItem.id)) {
        return false;
    }

    // Check excludes
    if (currentCrudItem.controlsExclude && currentCrudItem.controlsExclude.includes(crudItem.id)) {
        return false;
    }

    return !crudItem.pkRequired === !itemId;
}

function Crud(props: ICrudProps) {
    const components = useComponents();
    const dispatch = useDispatch();

    // Normalize items
    const items = useMemo(() => {
        // Array -> Object
        if (Array.isArray(props.items)) {
            props.items = props.items.reduce((obj, item: ICrudItem) => {
                obj[item.id] = {
                    ...item,
                };
                return obj;
            }, {});
        } else if (!props.items) {
            props.items = {};
        }

        // Merge with defaults
        Object.keys(defaultItems).forEach(id => {
            props.items[id] = {
                id,
                ...defaultItems[id],
                ...props.items[id],
                ...(typeof props[id] === 'object' ? props[id] : null),
            };
            if (props[id] === false) {
                props.items[id].visible = false;
            }
        });

        // Object -> Array + defaults
        return Object.keys(props.items).map(id => ({
            id,
            actionName: id,
            pkRequired: true,
            ...props.items[id],
        }));
    }, []);

    const {
        routeId,
        routeTitle,
        routeAction,
        action,
        itemId,
        routeParams,
        hasModal,
    } = useSelector(state => {
        const routeParams = getRouteParams(state);
        const queryKey = props.queryKey || DEFAULT_QUERY_KEY;
        const isModal = !!props.modalId;

        const routeAction = _get(routeParams, queryKey + 'Action') || _get(routeParams, queryKey) || CRUD_ACTION_INDEX;
        let itemId = _get(routeParams, queryKey + 'Action') ? _get(routeParams, queryKey) : null;

        let action = routeAction;
        const crudItem = props._items.find(item => item.actionName === action);
        const mode = crudItem && crudItem.mode || props.mode || DEFAULT_MODE;
        if (mode === MODE_MODAL && !isModal) {
            action = CRUD_ACTION_INDEX;
            itemId = null;
        }

        return {
            routeId: getRouteId(state),
            routeTitle: getRouteProp(state, null, 'title') || getRouteProp(state, null, 'label'),
            routeAction,
            action,
            itemId,
            routeParams,
            hasModal: !_isEmpty(getOpened(state)),
        };
    });


    const restUrl = typeof props.restUrl === 'function' ? props.restUrl(props) : props.restUrl;
    const fetchConfig = useMemo(() => itemId && restUrl && ({
        method: 'get',
        id: getCrudId(props) + '_' + itemId,
        url: `${restUrl}/${itemId}`,
    }), [])
    const {data, isLoading, fetch} = useFetch(fetchConfig);

    const onModalClose = useCallback(() => {
        dispatch([
            listRefresh(getCrudGridId(props)),
            goToRoute(routeId, {
                ...routeParams,
                [props.queryKey]: null,
                [props.queryKey + 'Action']: null,
            }),
        ]);
    }, []);

    const prevAction = usePrevious(props.prevAction || null);
    useEffect(() => {
        const crudItem = items.find(item => item.actionName === routeAction);
        const mode = crudItem && crudItem.mode || props.mode;
        const isModal = !!props.modalId;

        if (mode !== MODE_MODAL) {
            if (isModal) {
                props.dispatch(closeModal(getCrudModalId(props)));
            }
            return;
        }

        if (isModal) {
            return;
        }

        const nextAction = routeAction;
        if (prevAction !== nextAction) {
            if (prevAction === CRUD_ACTION_INDEX) {
                props.dispatch(closeModal(getCrudModalId(props)));
            }
            if (nextAction !== CRUD_ACTION_INDEX) {
                props.dispatch(openModal(Modal, {
                    modalId: getCrudModalId(props),
                    size: 'lg',
                    title: crudItem.title || crudItem.label || null,
                    onClose: onModalClose,
                    component: Crud,
                    componentProps: props,
                }));
            }
        }
    }, []);

    const onComplete = useCallback(() => {
        const crudItem = items.find(item => item.actionName === routeAction);
        const mode = crudItem && crudItem.mode || props.mode;
        if (mode === MODE_MODAL) {
            dispatch(closeModal(getCrudModalId(props)));
            onModalClose();
        } else {
            dispatch(goToRoute(routeId, {
                ...routeParams,
                [props.queryKey]: null,
                [props.queryKey + 'Action']: null,
            }));
        }
    }, []);

    const onClick = useCallback((e, currentItemId: PrimaryKey, item: any, crudItem: ICrudItem) => {
        // Custom confirm
        if (typeof crudItem.confirm === 'function') {
            const value = crudItem.confirm(e, currentItemId, item, props);
            const result = _isString(value) ? confirm(value) : !!value;
            if (!result) {
                e.preventDefault();
                return;
            }
        }
        crudItem.onClick(e, currentItemId, item, props);
    }, []);

    const getControls = useCallback((item = null) => {
        let currentAction;
        let currentItemId;
        const isGrid = !!item;

        if (hasModal && !props.modalId) {
            currentAction = CRUD_ACTION_INDEX
        } else {
            currentItemId = item && item[props.primaryKey];

            // Try get item id from route params
            if (!isGrid && !currentItemId) {
                currentItemId = itemId;
            }
        }

        const currentCrudItem = items.find(i => i.actionName === action);

        return (items || []).map((crudItem: ICrudItem) => {
            let visible = resolveVisible(currentCrudItem, crudItem, currentItemId, isGrid, hasModal);
            if (visible && typeof crudItem.visible === 'function') {
                visible = !!crudItem.visible(item, crudItem, isGrid);
            }

            const button: IControlItem = {
                ..._omit(crudItem, ['actionName', 'pkRequired', 'component', 'componentProps', 'visible', 'confirm', 'onClick']),
                confirm: typeof crudItem.confirm === 'string' ? crudItem.confirm : null,
                visible,
            };
            if (crudItem.onClick) {
                button.onClick = e => onClick(e, currentItemId, item, crudItem);
            } else {
                button.toRoute = routeId;
                button.toRouteParams = {
                    ...routeParams,
                    [props.queryKey]: crudItem.pkRequired ? currentItemId : undefined,
                    [props.queryKey + 'Action']: crudItem.actionName !== CRUD_ACTION_INDEX ? crudItem.actionName : undefined,
                };
            }

            return button;
        });
    }, []);

    let crudItem = items.find(item => item.actionName === action);
    const mode = crudItem && crudItem.mode || props.mode;
    const isModal = !!props.modalId;

    // In modal mode always render index on page
    if (mode === MODE_MODAL && !isModal) {
        crudItem = items.find(item => item.actionName === CRUD_ACTION_INDEX);
    }

    // No crud
    if (!crudItem) {
        return props.children;
    }

    // No render index in modal
    if (isModal && action === CRUD_ACTION_INDEX) {
        return null;
    }

    const ItemComponent = crudItem.component;
    const CrudView = /* TODO props.view || */components.ui.getView('crud.CrudView');
    const form = typeof props.form === 'function' ? props.form(props) : props.form;
    const grid = typeof props.grid === 'function' ? props.grid(props) : props.grid;
    return (
        <CrudView
            {...props}
            title={routeTitle}
            controls={getControls()}
        >
            {ItemComponent && (
                <ItemComponent
                    {...props}
                    restUrl={restUrl}
                    form={form}
                    grid={grid}
                    mode={mode}
                    routeId={routeId}
                    controlsGetter={getControls}
                    onComplete={onComplete}
                    {...crudItem.componentProps}
                />
            )}
        </CrudView>
    );

}

Crud.defaultProps = {
    primaryKey: DEFAULT_PRIMARY_KEY,
    queryKey: DEFAULT_QUERY_KEY,
    mode: DEFAULT_MODE,
};

export default Crud;