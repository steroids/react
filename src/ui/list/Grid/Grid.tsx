import _isString from 'lodash-es/isString';
import _upperFirst from 'lodash-es/upperFirst';
import React, {useCallback, useMemo} from 'react';

import {useComponents} from '../../../hooks';
import useList, {IListConfig, ListControlPosition} from '../../../hooks/useList';
import Format from '../../format/Format';
import {IControlItem} from '../../nav/Controls/Controls';
import {ILinkProps} from '../../nav/Link/Link';
import ControlsColumn from '../ControlsColumn';

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

    const {
        list,
        model,
        searchModel,
        paginationPosition,
        paginationSizePosition,
        layoutNamesPosition,
        renderList,
        renderLoading,
        renderEmpty,
        renderPagination,
        renderPaginationSize,
        renderLayoutNames,
        renderSearchForm,
        renderInfiniteScroll,
        onFetch,
        onSort,
        sort,
    } = useList({
        listId: props.listId,
        primaryKey: props.primaryKey,
        action: props.action,
        actionMethod: props.actionMethod,
        pagination: props.pagination,
        paginationSize: props.paginationSize,
        infiniteScroll: props.infiniteScroll,
        sort: props.sort,
        layout: props.layout,
        empty: props.empty,
        searchForm: props.searchForm,
        autoDestroy: props.autoDestroy,
        onFetch: props.onFetch,
        condition: props.condition,
        addressBar: props.addressBar,
        scope: props.scope,
        query: props.query,
        model: props.model,
        searchModel: props.searchModel,
        items: props.items,
        initialItems: props.initialItems,
        initialTotal: props.initialTotal,
        autoFetchOnFormChanges: props.autoFetchOnFormChanges,
    });

    const renderLabel = useCallback((column) => {
        if (column.headerView) {
            const HeaderView = column.headerView;
            return (
                <HeaderView
                    {...column}
                    {...column.headerProps}
                    listId={props.listId}
                />
            );
        }
        if (column.label || column.label === '') {
            return column.label;
        }

        const attributeMeta = []
            .concat(model?.attributes || [])
            .concat(searchModel?.attributes || [])
            .find(item => column.attribute && item.attribute === column.attribute);
        return attributeMeta ? attributeMeta.label : _upperFirst(column.attribute);
    }, [model, props.listId, searchModel]);

    const renderValue = useCallback((item, column: IGridColumn) => {
        // Custom component
        if (column.valueView) {
            const isValueViewString = typeof column.valueView === 'string';

            const ValueView = isValueViewString ? components.ui.getView(`list.${column.valueView}`) : column.valueView;

            const viewProps = {
                ...column,
                ...column.valueProps,
                listId: props.listId,
                primaryKey: props.primaryKey,
                item,
                size: props.size,
            };

            if (isValueViewString) {
                return components.ui.renderView(ValueView, viewProps);
            }

            return (
                <ValueView
                    {...viewProps}
                />
            );
        }

        return (
            <Format
                item={item}
                model={props.model}
                {...column}
                {...(column.formatter || {})}
            />
        );
    }, [props.listId, props.model, props.primaryKey]);

    // Columns
    const columns = useMemo(
        () => []
            .concat({
                label: __('№'),
                valueView: ({item}) => item.index + 1,
                visible: !!props.itemsIndexing,
            })
            .concat(props.columns)
            .concat({
                valueView: ControlsColumn,
                valueProps: {
                    controls: props.controls,
                },
                visible: !!props.controls,
            })
            .map(column => (_isString(column) ? {attribute: column} : column))
            .filter((column: IGridColumn) => column.visible !== false)
            .map(column => ({
                ...column,
                label: renderLabel(column),
            })),
        [props.columns, props.controls, props.itemsIndexing, renderLabel],
    );

    const viewProps = useMemo(() => ({
        ...props.viewProps,
        list,
        paginationPosition,
        paginationSizePosition,
        layoutNamesPosition,
        renderList,
        renderLoading,
        renderEmpty,
        renderPagination,
        renderPaginationSize,
        renderLayoutNames,
        renderSearchForm,
        renderInfiniteScroll,
        renderValue,
        columns,
        onFetch,
        onSort,
        sort,
        items: list?.items || [],
        searchForm: props.searchForm,
        listId: props.listId,
        isLoading: props.isLoading,
        size: props.size,
        hasAlternatingColors: props.hasAlternatingColors,
        className: props.className,
        primaryKey: props.primaryKey,
    }), [list, paginationPosition, paginationSizePosition, layoutNamesPosition, renderList, renderLoading, renderEmpty,
        renderPagination, renderPaginationSize, renderLayoutNames, renderSearchForm, renderInfiniteScroll, renderValue,
        columns, onFetch, onSort, sort, props.searchForm, props.listId, props.isLoading, props.size, props.hasAlternatingColors,
        props.className, props.primaryKey, props.viewProps]);

    return components.ui.renderView(props.view || 'list.GridView', viewProps);
}

Grid.defaultProps = {
    size: 'md',
    hasAlternatingColors: true,
};
