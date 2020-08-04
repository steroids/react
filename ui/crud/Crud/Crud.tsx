import * as React from 'react';
import _get from 'lodash-es/get';
import _isObject from 'lodash-es/isObject';
import _isArray from 'lodash-es/isArray';
import {connect} from 'react-redux';
import {components, normalize} from '../../../hoc';
import {getRouteId, getRouteParam, getRouteParams} from '../../../reducers/router';
import {goToRoute} from '../../../actions/router';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IConnectHocOutput} from '../../../hoc/connect';
import {IFormProps} from '../../form/Form/Form';
import {IGridProps} from '../../list/Grid/Grid';
import {IRouteItem} from '../../nav/Router/Router';
import CrudGrid from './CrudGrid';
import {IControlItem} from '../../nav/Controls/Controls';

export const getCrudGridId = props => props.crudId || props.baseRouteId;
export const getCrudFormId = props => [getCrudGridId(props), props.itemId].filter(Boolean).join('_');

export interface ICrudItem {
    id?: string,
    visible?: boolean,
    visibleFor?: string[],
    withModel?: boolean,
    component?: any,
    componentProps?: any,
    route?: IRouteItem,
    control?: IControlItem,
}

export interface ICrudProps {
    crudId?: string;
    baseRouteId?: string;
    view?: any;
    items?: ICrudItem[] | {[key: string]: ICrudItem};

    mode?: 'page' | 'modal',
    restUrl?: string,
    primaryKey?: 'id' | string,
    model?: string,
    searchModel?: string,
    grid?: IGridProps,
    gridComponent?: any,
    form?: IFormProps,
    formComponent?: any,
    detail?: any,
    detailComponent?: any,
}

export interface ICrudChildrenProps extends ICrudProps {
    item?: any,
    itemId?: PrimaryKey,
    controlsHandler?: any,
}

interface ICrudPrivateProps {
    _items?: ICrudItem[];
}

interface ICrudPrivateProps extends IConnectHocOutput, IComponentsHocOutput {
    routeId?: string,
    itemId?: PrimaryKey,
    routeParams?: any,
}

export const generateRouteId = (baseId, id) => baseId + (id !== 'index' ? '_' + id : '');

@normalize(
    {
        fromKey: 'items',
        toKey: '_items',
        normalizer: items => {
            if (_isObject(items) && !_isArray(items)) {
                return Object.keys(items).map(id => ({
                    id,
                    ...items[id],
                }));
            }
            return items;
        },
    },
)
@connect((state, props) => ({
    routeId: getRouteId(state),
    itemId: getRouteParam(state, props.primaryKey),
    routeParams: getRouteParams(state),
}))
@components('http', 'ui')
export default class Crud extends React.PureComponent<ICrudProps & ICrudPrivateProps> {

    static defaultProps = {
        primaryKey: 'id'
    };

    constructor(props) {
        super(props);

        this._controlsHandler = this._controlsHandler.bind(this);
    }

    render() {
        const CrudView = this.props.view || this.props.ui.getView('crud.CrudView');
        const GridComponent = this.props.gridComponent || CrudGrid;
        const props = {
            ...this.props,
            itemId: this.props.itemId,
            controlsHandler: this._controlsHandler,
        };
        return (
            <CrudView
                {...this.props}
                controls={this._getControls()}
            >
                {this.props.children
                    ? React.cloneElement(this.props.children as React.ReactElement<any>, props)
                    : <GridComponent {...props} />
                }
            </CrudView>
        );
    }

    _getControls(itemId = null) {
        itemId = itemId || _get(this.props, ['routeParams', this.props.primaryKey]);

        return this.props._items.map(item => {
            const control: IControlItem = {
                id: item.id,
                visible: itemId
                    ? item.withModel
                    : this.props.routeId !== generateRouteId(this.props.baseRouteId, item.id)
                        && (!!item.withModel === !!this.props.itemId),
            };
            if (item.route !== false) {
                control.toRoute = generateRouteId(this.props.baseRouteId, item.id);
                control.toRouteParams = {
                    ...this.props.routeParams,
                    [this.props.primaryKey]: item.withModel ? itemId : null,
                };
            }
            if (item.id === 'delete') {
                control.onClick = this._onDelete;
            }
            return control;
        });
    }

    _controlsHandler(item, primaryKey) {
        return this._getControls(item[primaryKey]);
    }

    async _onDelete() {
        await this.props.http.delete(`${this.props.restUrl}/${this.props.itemId}`);
        this.props.dispatch(goToRoute(this.props.baseRouteId));
    }
}
