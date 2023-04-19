import * as React from 'react';
import _upperFirst from 'lodash-es/upperFirst';
import _isString from 'lodash-es/isString';
import _isPlainObject from 'lodash-es/isPlainObject';
import _get from 'lodash-es/get';
import {useCallback, useMemo} from 'react';
import {useComponents} from '../../../hooks';
import useList, {IListConfig, ListControlPosition} from '../../../hooks/useList';
import ControlsColumn from '../ControlsColumn';
import Format from '../../format/Format';
import {IControlItem} from '../../nav/Controls/Controls';

interface IColumnCommonPropsView extends IGridColumn {
    item: Record<string, any>,
    size: Size,
    primaryKey: string,
    listId: string,

    [key: string]: any
}

export type IAvatarColumnViewProps = IColumnCommonPropsView

export interface ISubtitleColumnViewProps extends IColumnCommonPropsView {
    model: string,
}

export type ILinkColumnViewProps = IColumnCommonPropsView

export type IIconColumnViewProps = IColumnCommonPropsView

export type IPictureColumnViewProps = IColumnCommonPropsView

export interface IGridColumn {

    /**
     * Тип колонки
     */
    type: string,

    /**
     * Атрибут колонки, по которому происходит поиск нужного свойства в items и нужного поля в SearchForm
     * @example 'Name'
     */
    attribute?: string,

    /**
     * Атрибут иконки, по которому происходит поиск нужного свойства в items
     */
    itemIconAttribute?: string,

    /**
     * Свойства для компонента форматирования
     * @example {component: DateFormatter, format: 'DD MMMM'}
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
     * CSS-класс для ячейки с заголовком колонки <th>...</th>
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
    valueView?: any | 'SubtitleColumnView' | 'AvatarColumnView' | 'LinkColumnView' | 'IconColumnView' | 'PictureColumnView',

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
     * Название свойства для аватара или путь до свойства в items
     * @example 'avatar'
     */
    avatar?: string,

    /**
     * Название свойства в items, которое будет использовано как subtitle
     * @example 'name'
     */
    subtitle?: string,

    /**
    * Название свойства в items, которое будет использовано как link
    * @example {property: 'name', urlProperty: 'userUrl'}
    */
    link: {
        property: string,
        urlProperty: string,
    },

    /**
    * Название свойства в items, которое будет использовано как icon
    * @example {property: 'icon', isLeft: true}
    */
    icon: {
        property: string,
        isLeft?: boolean,
    },

    /**
    * Название свойства в items, которое будет использовано как icon
    * @example {property: 'icon', isLeft: true}
    */
    picture: {
        property: string,
        isLeft?: boolean,
    },
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
    view?: CustomView;

    /**
     * Коллекция с наименованиями и свойствами колонок в таблице
     * @example [{label: 'Name', attribute: 'name'}, {label: 'Work', attribute: 'work'}]
     */
    columns: (string | IGridColumn)[];

    /**
     * Коллекция с элементами управления. Данная коллекция отобразится в колонке рядом с каждой записью в таблице.
     * Например, кнопки для удаления и детального просмотра записи.
     * @example [{id: 'delete'}, {id: 'view', position: 'left'}]
     */
    controls?: IControlItem[] | ((item: any, primaryKey: string) => IControlItem[]);

    /**
     * Нужно ли отображать колонку с порядковым номером элемента? Если да, то для каждого элемента в коллекции items
     * должно быть задано свойство index
     */
    itemsIndexing?: any;

    /**
     * Размер Grid
     */
    size?: Size,

    /**
     * Включает стилизацию под зебру для Grid
     */
    isZebra?: boolean,

    [key: string]: any;
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
    renderPagination: () => any,
    renderPaginationSize: () => any,
    renderLayoutNames: () => any,
    renderSearchForm: () => any,
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
        renderEmpty,
        renderPagination,
        renderPaginationSize,
        renderLayoutNames,
        renderSearchForm,
        onFetch,
        onSort,
    } = useList({
        listId: props.listId,
        primaryKey: props.primaryKey,
        action: props.action,
        actionMethod: props.actionMethod,
        pagination: props.pagination,
        paginationSize: props.paginationSize,
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

            if (isValueViewString) {
                return components.ui.renderView(ValueView, {
                    ...column,
                    ...column.valueProps,
                    listId: props.listId,
                    primaryKey: props.primaryKey,
                    item,
                    size: props.size,
                });
            }

            return (
                <ValueView
                    {...column}
                    {...column.valueProps}
                    listId={props.listId}
                    primaryKey={props.primaryKey}
                    item={item}
                    size={props.size}
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

    return components.ui.renderView(props.view || 'list.GridView', {
        ...props,
        list,
        paginationPosition,
        paginationSizePosition,
        layoutNamesPosition,
        renderList,
        renderEmpty,
        renderPagination,
        renderPaginationSize,
        renderLayoutNames,
        renderSearchForm,
        renderValue,
        columns,
        onFetch,
        onSort,
        items: list?.items || [],
    });
}

Grid.defaultProps = {
    size: 'md',
    isZebra: true,
};
