import {useComponents, useSelector} from '../../../hooks';
import {getRouteBreadcrumbs, IRoute} from '../../../reducers/router';

/**
 * Breadcrumbs
 * Хлебные крошки
 */
export interface IBreadcrumbsProps {
    /**
     * Коллекция элементов навигационной цепочки
     * @example [{id: 'root', title: 'Home'}, {id: 'catalog', title: 'Catalog'}
     */
    items?: IRoute[];

    /**
     * Вместо items можно передать идентификатор текущего роута, от которого компонент самостоятельно построит
     * навигационную цепочку
     * @example 'catalog'
     */
    pageId?: string;

    /**
     * Заголовок текущей страницы. Если заголовок не задан, то подставится item.title
     * @example 'Каталог'
     */
    pageTitle?: string;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
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
