import _get from 'lodash-es/get';

import Crud from './Crud';
import {IRouteItem} from '../nav/Router/Router';
import {IGridProps} from '../list/Grid/Grid';
import {IFormProps} from '../form/Form/Form';

interface ICrudGeneratorProps {
    path: string,
    mode?: 'pages' | 'modal',
    restUrl?: string,
    primaryKey?: 'id' | string,
    model: string,
    index?: boolean | IRouteItem,
    create?: boolean | IRouteItem,
    update?: boolean | IRouteItem,
    view?: boolean | IRouteItem,
    items?: IRouteItem[] | {[key: string]: IRouteItem};
    grid?: IGridProps,
    form?: IFormProps,
}

const defaultProps = {
    mode: 'pages',
    primaryKey: 'id',
} as ICrudGeneratorProps;

const generateCrudItem = (id: string, name, props: ICrudGeneratorProps) => ({
    isVisible: true,
    isNavVisible: false,
    exact: name === 'index',
    component: Crud,
    componentProps: {
        baseRouteId: id,
        restUrl: props.restUrl,
        ..._get(props, [name, 'componentProps']),
    },
    ...props[name],
})

export {Crud};
export const generateCrud = (id: string, props = defaultProps as ICrudGeneratorProps) => {
    const items = {};

    props = {
        ...props,
        ...defaultProps,
    };

    // Create
    if (_get(props, 'create') !== false && _get(props, 'create.visible') !== false) {
        items[`${id}_create`] = {
            path: props.path + '/create',
            ...generateCrudItem(id, 'create', props),
        };
    }

    // Update
    if (_get(props, 'update') !== false && _get(props, 'update.visible') !== false) {
        items[`${id}_update`] = {
            path: props.path + '/:id/update',
            fetch: ({params}) => ({
                url: `${props.restUrl}/${params[props.primaryKey]}`,
                key: 'item'
            }),
            ...generateCrudItem(id, 'update', props),
        };
    }

    // Detail (view)
    if (_get(props, 'view') !== false && _get(props, 'view.visible') !== false) {
        items[`${id}_view`] = {
            path: props.path + '/:id/view',
            fetch: ({params}) => ({
                url: `${props.restUrl}/${params[props.primaryKey]}`,
                key: 'item'
            }),
            ...generateCrudItem(id, 'view', props),
        };
    }

    return {
        id,
        ...generateCrudItem(id, 'index', props),
        items: {
            ...props.items,
            ...items,
        },
    };
};
