import * as React from 'react';
import {useComponents} from '@steroidsjs/core/hooks';
import useList, {IListConfig, IListOutput} from '@steroidsjs/core/hooks/useList';

export interface IListProps extends IListConfig {
    itemView?: React.ComponentType;
    itemProps?: Record<string, unknown>;
    view?: React.ComponentType;
    className?: CssClassName;
    contentClassName?: string;
    [key: string]: any;
}

export interface IListViewProps extends Omit<IListProps, 'onFetch'>, Omit<IListOutput, 'list'> {
    content: any,
}

export interface IListItemViewProps {
    id: PrimaryKey,
    item: {
        id?: PrimaryKey,
        title?: string | any,
        label?: string | any,
    },
    index: number,
    className?: CssClassName;
    contentClassName?: string;
    layoutSelected?: PrimaryKey;
}

export default function List(props: IListProps) {
    const components = useComponents();
    const {
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
        //onFetch,
        //onSort,
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

    // Wait initialization
    if (!list) {
        return null;
    }

    const ItemView = props.itemView || components.ui.getView('list.ListItemView');
    const content = (list.items || []).map((item, index) => (
        <ItemView
            {...props.itemProps}
            key={item[props.primaryKey] || index}
            primaryKey={props.primaryKey}
            item={item}
            index={index}
            layoutSelected={list.layoutName}
        />
    ));

    return components.ui.renderView(props.view || 'list.ListView', {
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
        //onFetch,
        //onSort,
        content,
    });
}
