import _trimEnd from 'lodash/trimEnd';

import Crud from './Crud';
import {IRouteItem} from '../nav/Router/Router';
import {DEFAULT_PRIMARY_KEY, ICrudProps} from './Crud/Crud';

export interface ICrudGeneratorProps extends ICrudProps {
    path?: string,
    label?: string,
    models?: string | string[],
    route?: IRouteItem,
}

export {Crud};
export const generateCrud = (routeId: string, props: ICrudGeneratorProps) => {
    const pk = props.primaryKey || DEFAULT_PRIMARY_KEY;
    return {
        id: routeId,
        path: _trimEnd(props.path, '/') + `/:${pk}?/:${pk}Action?`,
        label: props.label,
        models: [
            props.model,
            props.searchModel,
        ].filter(Boolean).concat(props.models || []),
        component: Crud,
        ...props.route,
        componentProps: props,
    };
};
