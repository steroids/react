import _keys from 'lodash-es/keys';
import _uniq from 'lodash-es/uniq';
import _omit from 'lodash-es/omit';

import Crud from './Crud';
import {IRouteItem} from '../nav/Router/Router';
import {generateRouteId, ICrudItem, ICrudProps} from './Crud/Crud';
import {indexBy} from '../../utils/collection';
import CrudForm from './Crud/CrudForm';

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

const defaultItems = {
    index: {
        component: Crud,
    },
    create: {
        component: CrudForm,
    },
    update: {
        component: CrudForm,
    },
    delete: {
        route: false,
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
        }

        const isIndex = id === 'index';

        // Add route
        let route = null;
        if (item.route !== false) {
            route = {
                id: generateRouteId(baseRouteId, id),
                path: props.path + (
                    !isIndex
                        ? ('/' + (item.withModel ? `:${props.primaryKey}/` : '') + id)
                        : ''
                ),
                isVisible: true,
                isNavVisible: false,
                model: props.model,
                searchModel: props.searchModel,
                component: item.component,
                fetch: item.withModel
                    ? ({params}) => ({
                        url: `${props.restUrl}/${params[props.primaryKey]}`,
                        key: 'item',
                    })
                    : null,
                ...item.route,
                componentProps: {
                    ...item.componentProps,
                    ...item.route?.componentProps,
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

    return {
        ...indexRoute,
        componentProps: {
            ..._omit(props, _keys(defaultItems).concat('path')),
            ...indexRoute.componentProps,
            baseRouteId,
            items: crudItems,
        },
        items: routeItems,
    };
};
