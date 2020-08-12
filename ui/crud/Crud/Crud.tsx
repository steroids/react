import * as React from 'react';
import _get from 'lodash-es/get';
import _isString from 'lodash-es/isString';
import _isArray from 'lodash-es/isArray';
import _omit from 'lodash-es/omit';
import {connect} from 'react-redux';
import {components, normalize} from '../../../hoc';
import {getRouteId, getRouteParams} from '../../../reducers/router';
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

export interface ICrudItem extends Omit<IControlItem, 'visible' | 'confirm' | 'onClick'> {
    actionName?: string,
    pkRequired?: boolean,
    mode?: 'page' | 'modal',
    component?: any,
    componentProps?: any,
    visible?: boolean | ((item: any, crudItem: ICrudItem, isGrid: boolean) => boolean),
    confirm?: string | ((e: any, itemId: PrimaryKey, item: any, props: ICrudClickProps) => any),
    onClick?: (e: Event | React.MouseEvent, itemId: PrimaryKey, item: any, props: ICrudClickProps) => any,
}

export interface ICrudClickProps extends ICrudProps, IConnectHocOutput, IComponentsHocOutput {
    routeId?: string,
    routeParams?: any,
}

export interface ICrudProps {
    crudId?: string;
    mode?: 'page' | 'modal',
    restUrl?: string,
    primaryKey?: 'id' | string,
    model?: string,
    searchModel?: string,
    index?: boolean | ICrudItem,
    create?: boolean | ICrudItem,
    update?: boolean | ICrudItem,
    view?: boolean | ICrudItem,
    delete?: boolean | ICrudItem,
    items?: ICrudItem[] | { [key: string]: ICrudItem };
    grid?: IGridProps,
    gridComponent?: any,
    form?: IFormProps,
    formComponent?: any,
    detail?: IDetailProps,
    detailComponent?: any,
}

export interface ICrudChildrenProps extends ICrudProps, IConnectHocOutput, IComponentsHocOutput {
    item?: any,
    itemId?: PrimaryKey,
    routeId?: string,
    controlsGetter?: any,
}

interface ICrudPrivateProps extends IConnectHocOutput, IComponentsHocOutput {
    modalId?: string,
    routeId?: string,
    routeParams?: any,
    _items?: ICrudItem[];
}

export const DEFAULT_PRIMARY_KEY = 'id';
export const CRUD_ACTION_INDEX = 'index';

const getRouteItemId = props => {
    return _get(props, ['routeParams', props.primaryKey + 'Action'])
        ? _get(props, ['routeParams', props.primaryKey])
        : null;
};
const getRouteAction = props => {
    return _get(props, ['routeParams', props.primaryKey + 'Action'])
        || _get(props, ['routeParams', props.primaryKey])
        || CRUD_ACTION_INDEX;
};
export const getCrudId = (props: ICrudProps & ICrudPrivateProps) => props.crudId || props.routeId;
export const getCrudModalId = (props: ICrudProps & ICrudPrivateProps) => getCrudId(props);
export const getCrudGridId = (props: ICrudProps & ICrudPrivateProps) => getCrudId(props);
export const getCrudFormId = (props: ICrudProps & ICrudPrivateProps, suffix = null) => [getCrudId(props), getRouteItemId(props), suffix].filter(Boolean).join('_');

const defaultItems: ({ [key: string]: ICrudItem }) = {
    index: {
        component: CrudGrid,
        pkRequired: false,
    },
    create: {
        component: CrudForm,
        pkRequired: false,
    },
    update: {
        component: CrudForm,
    },
    view: {
        component: CrudDetail,
    },
    delete: {
        onClick: async (e, itemId, item, props) => {
            await props.http.delete(`${props.restUrl}/${itemId}`);

            props.dispatch(goToRoute(props.routeId, {
                ...props.routeParams,
                [props.primaryKey]: null,
                [props.primaryKey + 'Action']: null,
            }));
        }
    },
};

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
@connect(state => ({
    routeId: getRouteId(state),
    routeParams: getRouteParams(state),
}))
@components('http', 'ui')
export default class Crud extends React.PureComponent<ICrudProps & ICrudPrivateProps> {

    static defaultProps = {
        primaryKey: DEFAULT_PRIMARY_KEY,
        mode: 'page',
    };

    constructor(props) {
        super(props);

        this._getControls = this._getControls.bind(this);
    }

    componentDidMount() {
        this._modalUpdate();
    }

    componentDidUpdate(prevProps) {
        this._modalUpdate(prevProps);
    }

    render() {
        const action = getRouteAction(this.props);
        let crudItem = this.props._items.find(item => item.actionName === action);
        const mode = crudItem.mode || this.props.mode;
        const isModal = !!this.props.modalId;

        // In modal mode always render index on page
        if (mode === 'modal' && !isModal) {
            crudItem = this.props._items.find(item => item.actionName === CRUD_ACTION_INDEX);
        }

        // No render index in modal
        if (isModal && action === CRUD_ACTION_INDEX) {
            return null;
        }

        const ItemComponent = crudItem.component;
        const CrudView = /* TODO this.props.view || */this.props.ui.getView('crud.CrudView');
        return (
            <CrudView
                {...this.props}
                controls={this._getControls()}
            >
                {ItemComponent && (
                    <ItemComponent
                        {...this.props}
                        routeId={this.props.routeId}
                        itemId={getRouteItemId(this.props)}
                        controlsGetter={this._getControls}
                        {...crudItem.componentProps}
                    />
                )}
            </CrudView>
        );
    }

    _modalUpdate(prevProps = null) {
        const action = getRouteAction(this.props);
        const item = this.props._items.find(item => item.actionName === action);
        const mode = item.mode || this.props.mode;
        const isModal = !!this.props.modalId;

        if (mode !== 'modal') {
            if (isModal) {
                this.props.dispatch(closeModal(getCrudModalId(this.props)));
            }
            return;
        }

        if (isModal) {
            return;
        }

        const prevAction = prevProps ? getRouteAction(prevProps) : null;
        const nextAction = getRouteAction(this.props);
        if (prevAction !== nextAction) {
            if (prevAction === CRUD_ACTION_INDEX) {
                this.props.dispatch(closeModal(getCrudModalId(this.props)));
            }
            if (nextAction !== CRUD_ACTION_INDEX) {
                this.props.dispatch(openModal(Modal, {
                    modalId: getCrudModalId(this.props),
                    onClose: () => this.props.dispatch(goToRoute(this.props.routeId, {
                        ...this.props.routeParams,
                        [this.props.primaryKey]: null,
                        [this.props.primaryKey + 'Action']: null,
                    })),
                    component: Crud,
                    componentProps: this.props,
                }));
            }
        }
    }

    _getControls(item = null) {
        const action = getRouteAction(this.props);
        const isGrid = !!item;
        let itemId = item && item[this.props.primaryKey];

        // Try get item id from route params
        if (!isGrid && !itemId) {
            itemId = getRouteItemId(this.props);
        }

        return (this.props._items || []).map((crudItem: ICrudItem) => {
            let visible = this._resolveVisible(action, crudItem, item, isGrid);
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
                    [this.props.primaryKey]: crudItem.pkRequired ? itemId : undefined,
                    [this.props.primaryKey + 'Action']: crudItem.actionName !== CRUD_ACTION_INDEX ? crudItem.actionName : undefined,
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

    _resolveVisible(action, crudItem: ICrudItem, item: any, isGrid: boolean) {
        // Force disable visible
        if (crudItem.visible === false) {
            return false;
        }

        // Grid render only "pkRequired" actions
        if (isGrid) {
            return !!crudItem.pkRequired;
        }

        // Do not show index action in modal mode
        const isModal = !!this.props.modalId;
        if (isModal && crudItem.actionName === CRUD_ACTION_INDEX) {
            return false;
        }

        const mode = crudItem.mode || this.props.mode;
        // Index controls render only not-"pkRequired" actions
        if (mode === 'modal' && !isModal) {
            return !crudItem.pkRequired;
        }

        // No render control on self page
        if (action === crudItem.actionName) {
            return false;
        }

        // Always show index action in page mode
        if (mode === 'page' && action !== CRUD_ACTION_INDEX && crudItem.actionName === CRUD_ACTION_INDEX) {
            return true;
        }

        return !crudItem.pkRequired === !item;
    }
}
