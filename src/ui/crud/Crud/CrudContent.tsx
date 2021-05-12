import * as React from 'react';
import {useCallback} from 'react';
import {CRUD_ACTION_CREATE, CRUD_ACTION_INDEX, CRUD_ACTION_UPDATE} from './utils';
import {showNotification} from '../../../actions/notifications';
import useDispatch from '../../../hooks/useDispatch';
import {ICrudItem} from './Crud';
import Grid from '../../../ui/list/Grid';
import Form from '../../../ui/form/Form';
import {IApiRest} from '../../../components/ApiComponent';

export interface ICrudContentProps {
    crudId?: string,
    queryKey?: string,
    primaryKey?: string,
    model?: string,
    restUrl?: string,
    restApi?: IApiRest,
    items?: ICrudItem[],
    goToAction?: (nextAction: string) => any,
    itemsToControls?: any,
    record?: Record<string, unknown>,
    recordId?: PrimaryKey,
    action?: string,
}

export default function CrudContent(props: ICrudContentProps): JSX.Element {
    const dispatch = useDispatch();

    // Resolve ids
    const formId = [props.crudId, props.recordId].filter(Boolean).join('_');

    // Get current crud item
    const crudItem = props.items.find(item => item.actionName === props.action);

    const controlsGetter = useCallback((record, primaryKey) => props.itemsToControls.call(
        null,
        record,
        record[primaryKey] || null,
        props.action === CRUD_ACTION_INDEX
            ? props.items.filter(item => item.visible !== false && item.pkRequired)
            : [],
    ), [props.action, props.items, props.itemsToControls]);

    // Render content by action
    let ItemComponent = crudItem.component;
    switch (props.action) {
        case CRUD_ACTION_INDEX:
            if (!ItemComponent) {
                ItemComponent = Grid;
            }
            return (
                <ItemComponent // Grid
                    key={props.crudId + '_' + props.action}
                    listId={props.crudId}
                    action={props.restApi ? props.restApi.index : props.restUrl}
                    scope={['model', 'permission']}
                    primaryKey={props.primaryKey}
                    model={props.model}
                    //searchModel={props.searchModel}
                    controls={controlsGetter}
                    columns={[props.primaryKey]}
                    pagination={{
                        loadMore: false,
                    }}
                />
            );

        case CRUD_ACTION_CREATE:
        case CRUD_ACTION_UPDATE:
            if (!ItemComponent) {
                ItemComponent = Form;
            }
            return (
                <ItemComponent // Form
                    key={props.crudId + '_' + props.action}
                    formId={formId}
                    action={props.restApi
                        ? (props.recordId ? props.restApi.update : props.restApi.create)
                        : [props.restUrl, props.recordId].filter(Boolean).join('/')}
                    model={props.model}
                    autoFocus
                    submitLabel={props.recordId ? __('Сохранить') : __('Добавить')}
                    layout='horizontal'
                    onComplete={() => {
                        window.scrollTo(0, 0);
                        dispatch(showNotification(__('Запись успешно обновлена.')));

                        props.goToAction(CRUD_ACTION_INDEX);
                    }}
                    initialValues={props.action === CRUD_ACTION_CREATE ? {...props.record} : undefined}
                />
            );

        default:
            return null;
    }
}
