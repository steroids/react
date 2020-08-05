import * as React from 'react';
import _get from 'lodash-es/get';
import _isArray from 'lodash-es/isArray';
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

export interface ICrudItem {
    id?: string,
    action?: string,
    visible?: boolean,
    visibleFor?: string[],
    withModel?: boolean,
    component?: any,
    componentProps?: any,
    control?: IControlItem,
    onClick?: (e: any, item: PrimaryKey, props: ICrudClickProps) => any
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

export interface ICrudChildrenProps extends ICrudProps {
    item?: any,
    itemId?: PrimaryKey,
    routeId?: string,
    controlsGetter?: any,
}

interface ICrudPrivateProps extends IConnectHocOutput, IComponentsHocOutput {
    routeId?: string,
    routeParams?: any,
    _items?: ICrudItem[];
}

const getRouteItemId = props => {
    return _get(props, ['routeParams', props.primaryKey + 'Action'])
        ? _get(props, ['routeParams', props.primaryKey])
        : null;
};
const getRouteAction = props => {
    return _get(props, ['routeParams', props.primaryKey + 'Action'])
        || _get(props, ['routeParams', props.primaryKey])
        || 'index';
};

export const DEFAULT_PRIMARY_KEY = 'id';
export const getCrudGridId = (props: ICrudProps & ICrudPrivateProps) => props.crudId || props.routeId;
export const getCrudFormId = (props: ICrudProps & ICrudPrivateProps) => [getCrudGridId(props), getRouteItemId(props)].filter(Boolean).join('_');

const defaultItems: ({[key: string]: ICrudItem}) = {
    index: {
        component: CrudGrid,
    },
    create: {
        component: CrudForm,
    },
    update: {
        component: CrudForm,
        withModel: true,
    },
    view: {
        component: CrudDetail,
        withModel: true,
    },
    delete: {
        withModel: true,
        onClick: async (e, itemId, props) => {
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
                items = items.reduce((obj, item:ICrudItem) => {
                    obj[item.id] = item;
                    return obj;
                }, {});
            } else if (!items) {
                items = {};
            }

            // Merge with defaults
            Object.keys(defaultItems).forEach(id => {
                items[id] = {
                    id,
                    action: id,
                    withModel: false,
                    ...defaultItems[id],
                    ...items[id],
                    ...(typeof props[id] === 'object' ? props[id] : null),
                };
                if (props[id] === false) {
                    items[id].visible = false;
                }
            });

            // Object -> Array
            return Object.values(items);
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

    render() {
        const item = this.props._items.find(item => item.action === getRouteAction(this.props));
        const ItemComponent = item.component;

        const CrudView = this.props.view || this.props.ui.getView('crud.CrudView');
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
                        controlsGetter={item => this._getControls(item[this.props.primaryKey])}
                        {...item.componentProps}
                    />
                )}
            </CrudView>
        );
    }

    _getControls(itemId = null) {
        const action = getRouteAction(this.props);
        const isGrid = !!itemId;

        // Try get item id from route params
        if (!isGrid && !itemId) {
            itemId = getRouteItemId(this.props);
        }

        return (this.props._items || []).map(item => {
            const button: IControlItem = {
                id: item.id,
                visible: isGrid
                    ? item.withModel
                    : action !== item.action && (!item.withModel === !itemId || item.action === 'index'),
            };
            if (item.onClick) {
                button.onClick = e => item.onClick(e, itemId, this.props);
            } else {
                button.toRoute = this.props.routeId;
                button.toRouteParams = {
                    ...this.props.routeParams,
                    [this.props.primaryKey]: item.withModel ? itemId : undefined,
                    [this.props.primaryKey + 'Action']: item.id !== 'index' ? item.action : undefined,
                };
            }

            return button;
        });
    }
}
