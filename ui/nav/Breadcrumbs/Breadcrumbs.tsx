import {useComponents, useSelector} from '@steroidsjs/core/hooks';
import {getRouteBreadcrumbs} from '../../../reducers/router';

export interface IBreadcrumbsProps {
    items?: any[];
    pageId?: string;
    pageTitle?: string;
    view?: any;
    [key: string]: any;
}

export type IBreadcrumbsViewProps = IBreadcrumbsProps;

export default function Breadcrumbs(props: IBreadcrumbsProps) {
    const components = useComponents();
    const routeItems = useSelector(state => props.pageId ? getRouteBreadcrumbs(state, props.pageId) : null);
    const items = props.items || routeItems;

    return components.ui.renderView(props.view || 'nav.BreadcrumbsView', {
        ...props,
        items,
    });
}
