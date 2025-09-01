import {ReactElement, useMemo} from 'react';
import {useComponents, useSelector} from '../../../hooks';
import {getRouteBreadcrumbs, getRouteParams} from '../../../reducers/router';
import {IRouteItem} from '../Router/Router';

/**
 * Breadcrumbs
 *
 * Компонент Breadcrumbs отображает хлебные крошки.
 **/
export interface IBreadcrumbsProps {
    /**
     * Кастомный CSS-класс
     * @example 'CustomCssClassName'
     */
    className?: CssClassName,

    /**
     * Коллекция элементов навигационной цепочки
     * @example
     * [
     *  {
     *   id: 'root',
     *   title: 'Home'
     *  },
     *  {
     *   id: 'catalog',
     *   title: 'Catalog'
     *  }
     * ]
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
     * Показать иконку заменяющую первый роут
     * @example true
     */
    showIcon?: boolean,

    /**
     * Кастомная иконка, заменяющая первый роут
     */
    customIcon?: string | ReactElement,

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView,

    [key: string]: any,
}

export type IBreadcrumbsViewProps = IBreadcrumbsProps & {
    routeParams?: Record<string, unknown>,
};

export default function Breadcrumbs(props: IBreadcrumbsProps): JSX.Element {
    const components = useComponents();
    const routeItems = useSelector(state => getRouteBreadcrumbs(state, props.pageId));
    const routeParams = useSelector(state => getRouteParams(state));
    const items = props.items || routeItems;

    const viewProps = useMemo(() => ({
        items,
        routeParams,
        customIcon: props.customIcon,
        showIcon: props.showIcon,
        className: props.className,
        pageTitle: props.pageTitle,
    }), [items, props.className, props.customIcon, props.pageTitle, props.showIcon, routeParams]);

    return components.ui.renderView(props.view || 'nav.BreadcrumbsView', viewProps);
}
