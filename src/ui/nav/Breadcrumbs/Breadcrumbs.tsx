import {useComponents, useSelector} from '../../../hooks';
import {getRouteBreadcrumbs} from '../../../reducers/router';
import {IRouteItem} from '../Router/Router';

/**
 * Breadcrumbs
 * Хлебные крошки
 */
export interface IBreadcrumbsProps {
    /**
     * Кастомный CSS-класс
     * @example 'CustomCssClassName'
     */
    className?: CssClassName,

    /**
     * Коллекция элементов навигационной цепочки
     * @example [{id: 'root', title: 'Home'}, {id: 'catalog', title: 'Catalog'}]
     */
    items?: IRouteItem[],

    /**
     * Вместо items можно передать идентификатор роута, от которого компонент самостоятельно построит
     * навигационную цепочку
     * @example 'catalog'
     */
    pageId?: string,

    /**
     * Заголовок последней в списке страницы (обычно, это текущая страница, на которой находится пользователь).
     * Если заголовок не задан, то подставится item.title
     * @example 'Каталог'
     */
    pageTitle?: string,

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView,

    [key: string]: any,
}

export type IBreadcrumbsViewProps = IBreadcrumbsProps;

export default function Breadcrumbs(props: IBreadcrumbsProps): JSX.Element {
    const components = useComponents();
    const routeItems = useSelector(state => props.pageId ? getRouteBreadcrumbs(state, props.pageId) : null);
    const items = props.items || routeItems;

    return components.ui.renderView(props.view || 'nav.BreadcrumbsView', {
        ...props,
        items,
    });
}
