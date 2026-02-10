import _trimEnd from 'lodash-es/trimEnd';

import Crud from './Crud';
import {ICrudProps} from './Crud/Crud';
import {DEFAULT_QUERY_KEY} from './Crud/utils';
import {IRouteItem} from '../nav/Router/Router';

export interface ICrudGeneratorProps extends ICrudProps {
    path?: string,
    label?: string,
    models?: string | string[],
    enums?: string | string[],
    route?: IRouteItem,
}

export interface ICrudGeneratorRouteProps extends IRouteItem {
    queryKey?: 'id' | string,
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
