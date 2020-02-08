import * as React from 'react';
import {connect} from 'react-redux';
import _get from 'lodash-es/get';
import {components} from '../../../hoc';
import {getCurrentRoute} from '../../../reducers/navigation';
import {goToPage} from '../../../actions/navigation';
import {refresh} from '../../../actions/list';
import Grid from '../../list/Grid';
import Form from '../../form/Form';
import {showNotification} from '../../../actions/notifications';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IConnectHocOutput} from '../../../hoc/connect';
import {IControlItem} from '../Controls/Controls';
import {IFormViewProps} from '../../form/Form/Form';
import {IGridViewProps} from '../../list/Grid/Grid';
import {IDetailViewProps} from '../../list/Detail/Detail';

const getCrudId = props => props.crudId || props.baseRouteId;

export interface ICrudProps {
    editMode?: 'page' | 'modal';
    crudId?: string;
    baseRouteId?: string;
    restUrl?: string;
    controls?: IControlItem[];
    route?: {
        id?: string,
        isExact?: boolean,
        params?: any,
        path?: string,
        url?: string
    };
    grid?: any;
    form?: any;
    view?: any;
    gridView?: any;
    formView?: any;
    detailView?: any;
    actions?: any;
    item?: any;
    primaryKey?: any;
}

export interface ICrudViewProps extends ICrudProps {
    controls: IControlItem[],
}

export interface ICrudGridViewProps extends IGridViewProps {
}

export interface ICrudFormViewProps extends IFormViewProps {
}

export interface ICrudDetailViewProps extends IDetailViewProps {
}

interface ICrudPrivateProps extends IConnectHocOutput, IComponentsHocOutput {

}

@connect(state => ({
    route: getCurrentRoute(state)
}))
@components('http', 'ui')
export default class Crud extends React.PureComponent<ICrudProps & ICrudPrivateProps> {
    static defaultProps = {
        primaryKey: 'id'
    };

    constructor(props) {
        super(props);
        this._actionsHandler = this._actionsHandler.bind(this);
    }

    render() {
        const defaultControls = {
            index: {
                visible: true,
                toRoute: this.props.baseRouteId
            } as IControlItem,
            view: {
                visible: false
            } as IControlItem,
            create: {
                visible: true,
                toRoute: this.props.baseRouteId + '_create'
            } as IControlItem,
            update: {
                visible: false
            } as IControlItem,
            delete: {
                visible: false,
                position: 'right',
                onClick: async () => {
                    await this.props.http.delete(
                        `${this.props.restUrl}/${this.props.route.params.id}`
                    );
                    this.props.dispatch(goToPage(this.props.baseRouteId));
                }
            } as IControlItem
        };
        // Append default controls
        const controls = [].concat(this.props.controls || []);
        const controlsIds = controls.map(item => item.id).filter(Boolean);
        Object.keys(defaultControls).forEach(id => {
            if (!controlsIds.includes(id)) {
                controls.push({id});
            }
        });
        // Resolve content
        let content = null;
        switch (this.props.route.id) {
            case this.props.baseRouteId:
                content = this.renderGrid();
                defaultControls.index.visible = false;
                break;
            case this.props.baseRouteId + '_create':
                content = this.renderForm();
                defaultControls.create.visible = false;
                break;
            case this.props.baseRouteId + '_update':
                content = this.renderForm();
                defaultControls.create.visible = false;
                defaultControls.delete.visible = true;
                defaultControls.view = {
                    visible: !!this.props.detailView,
                    toRoute: this.props.baseRouteId + '_view',
                    toRouteParams: {
                        id: this.props.route.params.id
                    }
                };
                break;
            case this.props.baseRouteId + '_view':
                content = this.renderDetail();
                defaultControls.create.visible = false;
                defaultControls.delete.visible = true;
                defaultControls.update = {
                    visible: true,
                    toRoute: this.props.baseRouteId + '_update',
                    toRouteParams: {
                        id: this.props.route.params.id
                    }
                };
                break;
        }
        const CrudView = this.props.view || this.props.ui.getView('crud.CrudView');
        return (
            <CrudView
                {...this.props}
                controls={controls.map(item => ({
                    ...defaultControls[item.id],
                    ...item
                }))}
            >
                {content}
            </CrudView>
        );
    }

    renderGrid() {
        const restUrl = this.props.restUrl
            ? this.props.restUrl +
            (this.props.restUrl.indexOf('?') !== -1 ? '&' : '?') +
            'scope=model,permissions'
            : undefined;
        const GridComponent = this.props.gridView || Grid;
        return (
            <GridComponent
                listId={getCrudId(this.props)}
                action={restUrl}
                actionMethod='get'
                defaultPageSize={50}
                paginationSizeView={false}
                loadMore={false}
                primaryKey={this.props.primaryKey}
                emptyText={__('Нет записей')}
                columns={[this.props.primaryKey]}
                {...this.props.grid}
                actions={this._actionsHandler}
            />
        );
    }

    renderForm() {
        const FormComponent = this.props.formView || Form;
        return (
            <FormComponent
                formId={this._getFormId(this.props)}
                initialValues={this.props.item}
                action={
                    this.props.restUrl +
                    (this.props.route.params.id ? '/' + this.props.route.params.id : "")
                }
                autoFocus
                onComplete={() => {
                    window.scrollTo(0, 0);
                    this.props.dispatch(
                        showNotification('success', __('Запись успешно обновлена.'))
                    );
                }}
                {...this.props.form}
            />
        );
    }

    renderDetail() {
        const DetailView = this.props.detailView;
        if (DetailView) {
            return <DetailView/>;
        } else {
            return null;
        }
    }

    _actionsHandler(item, primaryKey) {
        const itemId = item[primaryKey];
        const defaultActions = {
            view: {
                visible: !!this.props.detailView,
                toRoute: this.props.baseRouteId + '_view',
                toRouteParams: {
                    id: itemId
                }
            },
            update: {
                toRoute: this.props.baseRouteId + '_update',
                toRouteParams: {
                    id: itemId
                }
            },
            delete: {
                onClick: async () => {
                    await this.props.http.delete(`${this.props.restUrl}/${itemId}`);
                    this.props.dispatch(refresh(getCrudId(this.props)));
                }
            }
        };
        // Append default actions
        const actions = [].concat(
            (this.props.grid && this.props.grid.actions) || []
        );
        const actionsIds = actions.map(item => item.id).filter(Boolean);
        Object.keys(defaultActions).forEach(id => {
            if (!actionsIds.includes(id)) {
                actions.push({id});
            }
        });
        return actions.map(action => ({
            ...defaultActions[action.id],
            ...action
        }));
    }

    _getFormId(props) {
        let formId = getCrudId(this.props);
        if (_get(props, 'item.id')) {
            formId += '_' + props.item.id;
        }
        return formId;
    }
}
