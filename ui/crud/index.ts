import _keys from 'lodash-es/keys';
import _uniq from 'lodash-es/uniq';
import _omit from 'lodash-es/omit';

import Crud from './Crud';
import {IRouteItem} from '../nav/Router/Router';
import {generateRouteId, ICrudItem, ICrudProps} from './Crud/Crud';
import {indexBy} from '../../utils/collection';
import CrudForm from './Crud/CrudForm';
import CrudGrid from './Crud/CrudGrid';

export interface ICrudGeneratorProps extends ICrudProps {
    path?: string,
    index?: boolean | ICrudItem,
    create?: boolean | ICrudItem,
    update?: boolean | ICrudItem,
    view?: boolean | ICrudItem,
    delete?: boolean | ICrudItem,
    items?: ICrudItem[] | {[key: string]: ICrudItem};
}

const defaultProps: ICrudGeneratorProps = {
    mode: 'page',
    primaryKey: 'id',
};

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
    delete: {
        route: false,
        withModel: true,
    },
};

export {Crud};
export const generateCrud = (baseRouteId: string, props = defaultProps as ICrudGeneratorProps) => {
    props = {
        ...props,
        ...defaultProps,
        items: indexBy(props.items, 'id'),
    };

    let indexRoute: IRouteItem = null;
    const routeItems: IRouteItem[] = [];
    const crudItems: ICrudItem[] = [];
    _uniq(_keys(defaultItems).concat(_keys(props.items))).forEach(id => {
        let item: ICrudItem = props.items?.[id] || props[id];
        if (item === false || item?.visible === false) {
            return;
        }

        // Merge with defaults
        item = {
            ...defaultItems[id],
            ...item,
            id,
        }

        const isIndex = id === 'index';

        // Add route
        let route = null;
        if (item.route !== false) {
            const routeProps = item.route === 'object' ? item.route : {};
            route = {
                id: generateRouteId(baseRouteId, id),
                path: props.path + (
                    !isIndex
                        ? ('/' + (item.withModel ? `:${props.primaryKey}/` : '') + id)
                        : ''
                ),
                exact: true,
                isVisible: true,
                isNavVisible: false,
                model: props.model,
                searchModel: props.searchModel,
                component: Crud,
                fetch: item.withModel
                    ? ({params}) => ({
                        url: `${props.restUrl}/${params[props.primaryKey]}`,
                        key: 'item',
                    })
                    : null,
                ...routeProps,
                componentProps: {
                    component: item.component,
                    ...item.componentProps,
                    ...routeProps.componentProps,
                },
            };

            if (isIndex) {
                indexRoute = route;
            } else {
                routeItems.push(route);
            }
        }

        // Add crud items
        crudItems.push(item);
    });

    const crudProps = {
        ..._omit(props, _keys(defaultItems).concat('path')),
        baseRouteId,
        items: crudItems,
    };

    return {
        ...indexRoute,
        componentProps: {
            ...crudProps,
            ...indexRoute.componentProps,
        },
        items: routeItems.map(routeItem => ({
            ...routeItem,
            componentProps: {
                ...crudProps,
                ...routeItem.componentProps,
            },
        })),
    };
};
