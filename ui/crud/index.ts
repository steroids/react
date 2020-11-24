import _trimEnd from 'lodash/trimEnd';

import Crud from './Crud';
import {IRouteItem} from '../nav/Router/Router';
import {DEFAULT_QUERY_KEY, ICrudProps} from './Crud/Crud';

export interface ICrudGeneratorProps extends ICrudProps {
    path?: string,
    label?: string,
    models?: string | string[],
    enums?: string | string[],
    route?: IRouteItem,
}

export {Crud};
export const generateCrud = (routeId: string, props: ICrudGeneratorProps) => {
    const queryKey = props.queryKey || DEFAULT_QUERY_KEY;
    return {
        id: routeId,
        path: _trimEnd(props.path, '/') + `/:${queryKey}?/:${queryKey}Action?`,
        label: props.label,
        models: [
            props.model,
            props.searchModel,
        ].filter(Boolean).concat(props.models || []),
        enums: props.enums,
        component: Crud,
        ...props.route,
        componentProps: props,
    };
};
