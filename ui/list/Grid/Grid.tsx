import * as React from 'react';
import _get from 'lodash-es/get';
import _upperFirst from 'lodash-es/upperFirst';
import _isString from 'lodash-es/isString';
import {useComponents} from '@steroidsjs/core/hooks';
import {ReactChildren, useCallback, useMemo} from 'react';
import useList, {IListConfig, ListControlPosition} from '@steroidsjs/core/hooks/useList';
import ControlsColumn from '../ControlsColumn';
import Format from '../../format/Format';
import {IControlItem} from '../../nav/Controls/Controls';

export interface IGridColumn {
    attribute?: string,
    format?:
        | string
        | {
        component?: string | ((...args: any[]) => any)
    },
    label?: React.ReactNode,
    hint?: React.ReactNode,
    headerClassName?: CssClassName,
    visible?: boolean,
    headerView?: any,
    headerProps?: any,
    valueView?: any,
    valueProps?: any,
    className?: CssClassName,
    sortable?: boolean,
}

export interface IGridProps extends IListConfig {
    view?: any;
    columns: (string | IGridColumn)[];
    controls?: IControlItem[] | ((item: any, primaryKey: string) => IControlItem[]);
    itemsIndexing?: any;
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

export default function Grid(props: IGridProps) {
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

        const attributeMeta = _get(model, 'formatters' + column.attribute)
            || _get(searchModel, 'formatters' + column.attribute);
        return attributeMeta ? attributeMeta.label : _upperFirst(column.attribute);
    }, [model, props.listId, searchModel]);

    const renderValue = useCallback((item, column) => {
        // Custom component
        if (column.valueView) {
            const ValueView = column.valueView;
            return (
                <ValueView
                    {...column}
                    {...column.valueProps}
                    listId={props.listId}
                    primaryKey={props.primaryKey}
                    item={item}
                />
            );
        }

        return <Format item={item} model={props.model} {...column} />;
    }, [props.listId, props.model, props.primaryKey]);

    // Columns
    const columns = useMemo(
        () => []
            .concat({
                label: __('№'),
                valueView: ({item}) => {
                    return item.index + 1
                },
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
        items: list?.items || []
    });
}
