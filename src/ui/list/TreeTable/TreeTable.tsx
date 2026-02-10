import * as React from 'react';
import {useCallback, useMemo} from 'react';
import _merge from 'lodash-es/merge';
import {ITreeProps} from '@steroidsjs/core/ui/nav/Tree/Tree';
import Format from '@steroidsjs/core/ui/format/Format';
import ControlsColumn from '@steroidsjs/core/ui/list/ControlsColumn';
import _upperFirst from 'lodash-es/upperFirst';
import _isString from 'lodash-es/isString';
import {useComponents} from '@steroidsjs/core/hooks';
import useTree, {IPreparedTreeItem, ITreeItem} from '../../../hooks/useTree';
import {IColumnViewProps, IGridColumn, IGridProps} from '../Grid/Grid';
import useList from '../../../hooks/useList';

export interface ITreeColumnViewProps extends IColumnViewProps, Pick<ITreeTableProps, 'levelPadding' | 'customIcon' > {
    item: IPreparedTreeItem,
}

/**
 * TreeTable
 *
 * Компонент для представления данных коллекции в виде иерархической структуры.
 */
export interface ITreeTableProps extends Omit<IGridProps, 'items' | 'itemsIndexing'>,
    Pick<ITreeProps, 'alwaysOpened' | 'levelPadding' | 'customIcon' | 'saveInClientStorage' | 'collapseChildItems'>{
    /**
     * Элементы коллекции
     * @example
     * [
     *  {
     *   id: 1,
     *   name: 'Jane'
     *  },
     *  {
     *   id: 2,
     *   name: 'John',
     *   items: [...]
     *  }
     * ]
     */
    items?: ITreeItem[],

    /**
     * Если флаг true, то данные в items переданы только для одной страницы, если false, то данные в items переданы сразу для всех страниц
     * @example true
     */
    isSinglePageItems?: boolean,

    /**
     * Кастомная иконка для сворачивания элементов
     * @example 'arrow'
     */
    customIcon?: string | React.ReactElement,

    /**
     * Ключ для доступа к вложенным элементам узла
     * @example 'items'
     */
    itemsKey?: string,

    itemsIndexing?: never,
}

const TREE_COLUMN_VIEW_FIELDS = {
    valueView: 'TreeColumnView',
    headerClassName: 'TreeColumnHeader',
};

export const addTreeColumnFieldsToFirstColumn = (columns: IGridColumn[], levelPadding: string | number, customIcon?: string | React.ReactElement) => {
    const newColumns = [...columns];

    // Add tree view to the first column
    _merge(newColumns[0], {
        ...TREE_COLUMN_VIEW_FIELDS,
        levelPadding,
        customIcon,
    });

    return newColumns;
};

export default function TreeTable(props: ITreeTableProps): JSX.Element {
    const components = useComponents();

    const mergedColumns = useMemo(
        () => addTreeColumnFieldsToFirstColumn(props.columns, props.levelPadding, props.customIcon),
        [props.columns, props.customIcon, props.levelPadding],
    );

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

    const items = useMemo(() => list?.items || [], [list?.items]);

    const {treeItems} = useTree({
        items,
        autoOpenLevels: 0,
        alwaysOpened: props.alwaysOpened,
        collapseChildItems: props.collapseChildItems,
        saveInClientStorage: props.saveInClientStorage,
        clientStorageId: props.listId,
        isSinglePageItems: props.isSinglePageItems,
        itemsKey: props.itemsKey,
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
                visible: false,
            })
            .concat(mergedColumns)
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
        [mergedColumns, props.controls, renderLabel],
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
        items: treeItems,
        searchForm: props.searchForm,
        listId: props.listId,
        isLoading: props.isLoading,
        size: props.size,
        hasAlternatingColors: props.hasAlternatingColors,
        className: props.className,
        primaryKey: props.primaryKey,
    }), [treeItems, list, paginationPosition, paginationSizePosition, layoutNamesPosition, renderList, renderLoading, renderEmpty,
        renderPagination, renderPaginationSize, renderLayoutNames, renderSearchForm, renderInfiniteScroll, renderValue,
        columns, onFetch, onSort, sort, props.searchForm, props.listId, props.isLoading, props.size, props.hasAlternatingColors,
        props.className, props.primaryKey, props.viewProps]);

    return components.ui.renderView(props.view || 'list.GridView', viewProps);
}

TreeTable.defaultProps = {
    levelPadding: 32,
    alwaysOpened: false,
    saveInClientStorage: false,
    collapseChildItems: false,
    size: 'md',
    hasAlternatingColors: false,
};
