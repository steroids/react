import React, {useCallback, useMemo} from 'react';
import _isString from 'lodash-es/isString';
import _upperFirst from 'lodash-es/upperFirst';
import useComponents from '../../../hooks/useComponents';
import useList from '../../../hooks/useList';
import ControlsColumn from '../ControlsColumn';
import Format from '../../format/Format';
import {IGridColumn, IGridProps} from '../Grid/Grid';

export default function useGridBase(props: IGridProps) {
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

    return {
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
        renderValue,
        onFetch,
        onSort,
        sort,
        columns,
    };
}
