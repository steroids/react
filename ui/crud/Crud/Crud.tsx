import * as React from 'react';
import _get from 'lodash-es/get';
import _isString from 'lodash-es/isString';
import _isArray from 'lodash-es/isArray';
import _isEmpty from 'lodash-es/isEmpty';
import _omit from 'lodash-es/omit';
import {components, connect, fetch, normalize} from '../../../hoc';
import {getRouteId, getRouteParams, getRouteProp} from '../../../reducers/router';
import {goToRoute} from '../../../actions/router';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IConnectHocOutput} from '../../../hoc/connect';
import {IFormProps} from '../../form/Form/Form';
import {IGridProps} from '../../list/Grid/Grid';
import CrudGrid from './CrudGrid';
import {IControlItem} from '../../nav/Controls/Controls';
import {IDetailProps} from '../../list/Detail/Detail';
import CrudForm from './CrudForm';
import CrudDetail from './CrudDetail';
import {closeModal, openModal} from '../../../actions/modal';
import Modal from '../../modal/Modal';
import {getOpened} from '../../../reducers/modal';
import {listRefresh} from '../../../actions/list';
import {ReactNode} from 'react';

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
    detail?: IDetailProps,
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

interface ICrudPrivateProps extends IConnectHocOutput, IComponentsHocOutput {
    item?: any,
    itemId?: PrimaryKey,
    action?: string,
    modalId?: string,
    routeId?: string,
    routeTitle?: string,
    routeAction?: string,
    routeParams?: any,
    hasModal?: boolean,
    _items?: ICrudItem[];
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

export const getCrudId = (props: ICrudProps & ICrudPrivateProps) => props.crudId || props.routeId;
export const getCrudModalId = (props: ICrudProps & ICrudPrivateProps) => getCrudId(props);
export const getCrudGridId = (props: ICrudProps & ICrudPrivateProps) => getCrudId(props);
export const getCrudFormId = (props: ICrudProps & ICrudPrivateProps, suffix = null) => [getCrudId(props), props.itemId, suffix].filter(Boolean).join('_');

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

@components('http', 'ui')
@normalize(
    {
        fromKey: 'items',
        toKey: '_items',
        normalizer: (items, props) => {
            // Array -> Object
            if (_isArray(items)) {
                items = items.reduce((obj, item: ICrudItem) => {
                    obj[item.id] = {
                        ...item,
                    };
                    return obj;
                }, {});
            } else if (!items) {
                items = {};
            }

            // Merge with defaults
            Object.keys(defaultItems).forEach(id => {
                items[id] = {
                    id,
                    ...defaultItems[id],
                    ...items[id],
                    ...(typeof props[id] === 'object' ? props[id] : null),
                };
                if (props[id] === false) {
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
        },
    },
)
@connect((state, props) => {
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
})
@fetch(props => {
    const restUrl = typeof props.restUrl === 'function' ? props.restUrl(props) : props.restUrl;
    return props.itemId && restUrl && {
        id: getCrudId(props) + '_' + props.itemId,
        url: `${restUrl}/${props.itemId}`,
        key: 'item',
    };
})
export default class Crud extends React.PureComponent<ICrudProps & ICrudPrivateProps> {

    static defaultProps = {
        primaryKey: DEFAULT_PRIMARY_KEY,
        queryKey: DEFAULT_QUERY_KEY,
        mode: DEFAULT_MODE,
    };

    constructor(props) {
        super(props);

        this._getControls = this._getControls.bind(this);
        this._onComplete = this._onComplete.bind(this);
        this._onModalClose = this._onModalClose.bind(this);
    }

    componentDidMount() {
        this._modalUpdate();
    }

    componentDidUpdate(prevProps) {
        this._modalUpdate(prevProps);
    }

    render() {
        let crudItem = this.props._items.find(item => item.actionName === this.props.action);
        const mode = crudItem && crudItem.mode || this.props.mode;
        const isModal = !!this.props.modalId;

        // In modal mode always render index on page
        if (mode === MODE_MODAL && !isModal) {
            crudItem = this.props._items.find(item => item.actionName === CRUD_ACTION_INDEX);
        }

        // No crud
        if (!crudItem) {
            return this.props.children;
        }

        // No render index in modal
        if (isModal && this.props.action === CRUD_ACTION_INDEX) {
            return null;
        }

        const ItemComponent = crudItem.component;
        const CrudView = /* TODO this.props.view || */this.props.ui.getView('crud.CrudView');
        const restUrl = typeof this.props.restUrl === 'function' ? this.props.restUrl(this.props) : this.props.restUrl;
        const form = typeof this.props.form === 'function' ? this.props.form(this.props) : this.props.form;
        const grid = typeof this.props.grid === 'function' ? this.props.grid(this.props) : this.props.grid;
        return (
            <CrudView
                {...this.props}
                title={this.props.routeTitle}
                controls={this._getControls()}
            >
                {ItemComponent && (
                    <ItemComponent
                        {...this.props}
                        restUrl={restUrl}
                        form={form}
                        grid={grid}
                        mode={mode}
                        routeId={this.props.routeId}
                        controlsGetter={this._getControls}
                        onComplete={this._onComplete}
                        {...crudItem.componentProps}
                    />
                )}
            </CrudView>
        );
    }

    _modalUpdate(prevProps: ICrudProps & ICrudPrivateProps = null) {
        const crudItem = this.props._items.find(item => item.actionName === this.props.routeAction);
        const mode = crudItem && crudItem.mode || this.props.mode;
        const isModal = !!this.props.modalId;

        if (mode !== MODE_MODAL) {
            if (isModal) {
                this.props.dispatch(closeModal(getCrudModalId(this.props)));
            }
            return;
        }

        if (isModal) {
            return;
        }

        const prevAction = prevProps ? prevProps.routeAction : null;
        const nextAction = this.props.routeAction;
        if (prevAction !== nextAction) {
            if (prevAction === CRUD_ACTION_INDEX) {
                this.props.dispatch(closeModal(getCrudModalId(this.props)));
            }
            if (nextAction !== CRUD_ACTION_INDEX) {
                this.props.dispatch(openModal(Modal, {
                    modalId: getCrudModalId(this.props),
                    size: 'lg',
                    title: crudItem.title || crudItem.label || null,
                    onClose: this._onModalClose,
                    component: Crud,
                    componentProps: this.props,
                }));
            }
        }
    }

    _onComplete() {
        const crudItem = this.props._items.find(item => item.actionName === this.props.routeAction);
        const mode = crudItem && crudItem.mode || this.props.mode;
        if (mode === MODE_MODAL) {
            this.props.dispatch(closeModal(getCrudModalId(this.props)));
            this._onModalClose();
        } else {
            this.props.dispatch(goToRoute(this.props.routeId, {
                ...this.props.routeParams,
                [this.props.queryKey]: null,
                [this.props.queryKey + 'Action']: null,
            }));
        }
    }

    _onModalClose() {
        this.props.dispatch([
            listRefresh(getCrudGridId(this.props)),
            goToRoute(this.props.routeId, {
                ...this.props.routeParams,
                [this.props.queryKey]: null,
                [this.props.queryKey + 'Action']: null,
            }),
        ]);
    }

    _getControls(item = null) {
        let action;
        let itemId;
        const isGrid = !!item;

        if (this.props.hasModal && !this.props.modalId) {
            action = CRUD_ACTION_INDEX
        } else {
            action = this.props.action;
            itemId = item && item[this.props.primaryKey];

            // Try get item id from route params
            if (!isGrid && !itemId) {
                itemId = this.props.itemId;
            }
        }

        const currentCrudItem = this.props._items.find(i => i.actionName === action);

        return (this.props._items || []).map((crudItem: ICrudItem) => {
            let visible = this._resolveVisible(currentCrudItem, crudItem, itemId, isGrid);
            if (visible && typeof crudItem.visible === 'function') {
                visible = !!crudItem.visible(item, crudItem, isGrid);
            }

            const button: IControlItem = {
                ..._omit(crudItem, ['actionName', 'pkRequired', 'component', 'componentProps', 'visible', 'confirm', 'onClick']),
                confirm: typeof crudItem.confirm === 'string' ? crudItem.confirm : null,
                visible,
            };
            if (crudItem.onClick) {
                button.onClick = e => this._onClick(e, itemId, item, crudItem);
            } else {
                button.toRoute = this.props.routeId;
                button.toRouteParams = {
                    ...this.props.routeParams,
                    [this.props.queryKey]: crudItem.pkRequired ? itemId : undefined,
                    [this.props.queryKey + 'Action']: crudItem.actionName !== CRUD_ACTION_INDEX ? crudItem.actionName : undefined,
                };
            }

            return button;
        });
    }

    _onClick(e, itemId: PrimaryKey, item: any, crudItem: ICrudItem) {
        // Custom confirm
        if (typeof crudItem.confirm === 'function') {
            const value = crudItem.confirm(e, itemId, item, this.props);
            const result = _isString(value) ? confirm(value) : !!value;
            if (!result) {
                e.preventDefault();
                return;
            }
        }
        crudItem.onClick(e, itemId, item, this.props);
    }

    _resolveVisible(currentCrudItem: ICrudItem, crudItem: ICrudItem, itemId: PrimaryKey, isGrid: boolean) {
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
            return !this.props.hasModal;
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
}
