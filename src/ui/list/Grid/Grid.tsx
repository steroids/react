import React from 'react';
import useGridBase from '@steroidsjs/core/ui/list/hooks/useGridBase';
import {ILinkProps} from '../../nav/Link/Link';
import {useComponents} from '../../../hooks';
import {IListConfig, ListControlPosition} from '../../../hooks/useList';
import {IControlItem} from '../../nav/Controls/Controls';

export interface IColumnViewProps extends IGridColumn {
    item: Record<string, any>,
    size: Size,
    primaryKey: string,
    listId: string,
    model: string,

    [key: string]: any,
}

export interface IGridColumn {
    /**
     * Атрибут колонки, по которому происходит поиск нужного свойства в items и нужного поля в SearchForm
     * @example 'Name'
     */
    attribute?: string,

    /**
     * Свойства для компонента форматирования
     * @example
     * {
     *  component: DateFormatter,
     *  format: 'DD MMMM'
     * }
     */
    formatter?: Record<string, any>,

    /**
     * Заголовок колонки
     * @example 'Name'
     */
    label?: React.ReactNode,

    /**
     * Подсказка
     * @example 'Some text'
     */
    hint?: React.ReactNode,

    /**
     * CSS-класс для ячейки с заголовком колонки '<th>...</th>'
     */
    headerClassName?: CssClassName,

    /**
     * Скрыть или показать колонку
     * @example true
     */
    visible?: boolean,

    /**
     * Компонент для кастомизации отображения заголовка колонки
     * @example MyCustomView
     */
    headerView?: any,

    /**
     * Свойства для компонента отображения заголовка колонки
     */
    headerProps?: any,

    /**
     * Компонент для кастомизации отображения значения в ячейке
     * @example MyCustomView
     */
    valueView?: any | 'ContentColumnView',

    /**
     * Свойства для компонента отображения значения в ячейке
     */
    valueProps?: any,

    /**
     * CSS-класс для ячейки со значением
     */
    className?: CssClassName,

    /**
     * Включить возможность сортировки по данным в колонке
     * @example true
     */
    sortable?: boolean,

    /**
     * Название свойства в items, которое будет использовано как subtitle
     * @example 'name'
     */
    subtitleAttribute?: string,

    /**
     * Параметры для ссылки в колонке
    * @example
     * {
     *  attribute: 'name',
     *  linkProps: {target: 'blank'},
     *  url: 'https://kozhindev.com'
     * }
    */
    link?: {
        attribute: string,
        linkProps?: ILinkProps,
        urlAttribute: string,
    },

    /**
    * Параметры для иконки в колонке
    * @example
     * {
     *  attribute: 'icon',
     *  isLeft: true
     * }
    */
    icon?: {
        attribute: string,
        isLeft?: boolean,
    },

    /**
    *  Параметры для картинки в колонке
    * @example
     * {
     *  attribute: 'icon',
     *  isLeft: true
     * }
    */
    picture?: {
        attribute: string,
        isLeft?: boolean,
    },

    /**
    * Диаграмма.
    * Цвет должен соответствовать success | warning | danger | secondary.
    * Цвета можно расширить или изменить через стили (см. colors.scss в react-bootstrap)
    */
    diagram?: {
        type: 'horizontal' | 'vertical' | 'circle',
        items: {
            color: 'success' | 'warning' | 'danger' | 'secondary' | string,
            percentageAttribute: string,
        }[],
    },

    [key: string]: any,
}

/**
 * Grid
 * Компонент для представления данных коллекции в виде таблицы.
 */
export interface IGridProps extends IListConfig {
    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView,

    /**
     * Пропсы для отображения элемента
     */
    viewProps?: CustomViewProps,

    /**
     * Коллекция с наименованиями и свойствами колонок в таблице
     * @example
     * [
     *  {
     *   label: 'Name',
     *   attribute: 'name'
     *  },
     *  {
     *   label: 'Work',
     *   attribute: 'work'
     *  }
     * ]
     */
    columns: (string | IGridColumn)[],

    /**
     * Коллекция с элементами управления. Данная коллекция отобразится в колонке рядом с каждой записью в таблице.
     * Например, кнопки для удаления и детального просмотра записи.
     * @example
     * [
     *  {
     *   id: 'delete'
     *  },
     *  {
     *   id: 'view',
     *   position: 'left'
     *  }
     * ]
     */
    controls?: IControlItem[] | ((item: any, primaryKey: string) => IControlItem[]),

    /**
     * Нужно ли отображать колонку с порядковым номером элемента? Если да, то для каждого элемента в коллекции items
     * должно быть задано свойство index
     */
    itemsIndexing?: any,

    /**
     * Размер Grid
     */
    size?: Size,

    /**
     * Включает переменные цвета для строк в таблице
     */
    hasAlternatingColors?: boolean,

    [key: string]: any,
}

export interface IGridViewProps extends Omit<IGridProps, 'onFetch'> {
    className: CssClassName,
    columns: (IGridColumn & {
        label: any,
    })[],
    paginationPosition: ListControlPosition,
    paginationSizePosition: ListControlPosition,
    layoutNamesPosition: ListControlPosition,
    renderList: (children: any) => any,
    renderEmpty: () => any,
    renderLoading: () => any,
    renderPagination: () => any,
    renderPaginationSize: () => any,
    renderLayoutNames: () => any,
    renderSearchForm: () => any,
    renderInfiniteScroll: () => any,
    renderValue: (item: Record<string, unknown>, column: IGridColumn) => any,
    onFetch: (params?: Record<string, unknown>) => void,
    onSort: (value: any) => void,
}

export default function Grid(props: IGridProps): JSX.Element {
    const components = useComponents();

    const grid = useGridBase(props);

    const viewProps = {
        ...props.viewProps,
        ...grid,
        items: grid.list?.items || [],
        listId: props.listId,
        primaryKey: props.primaryKey,
        isLoading: props.isLoading,
        size: props.size,
        className: props.className,
        hasAlternatingColors: props.hasAlternatingColors,
        searchForm: props.searchForm,
    };

    return components.ui.renderView(props.view || 'list.GridView', viewProps);
}

Grid.defaultProps = {
    size: 'md',
    hasAlternatingColors: true,
};
