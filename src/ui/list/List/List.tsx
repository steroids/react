import * as React from 'react';
import {useComponents} from '../../../hooks';
import useList, {IListConfig, IListOutput} from '../../../hooks/useList';

/**
 * List
 * Компонент для представления коллекции в виде списка.
 */
export interface IListProps extends IListConfig {
    /**
     * Переопределение view React компонента для кастомизации отображения элемента коллекции
     * @example MyCustomView
     */
    itemView?: CustomView;

    /**
     * Свойства для элемента коллекции
     */
    itemProps?: Record<string, unknown>;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;

    /**
     * Дополнительный CSS-класс для элемента отображения
     */
    className?: CssClassName;

    /**
     * Дополнительный CSS-класс для элемента с контентом
     */
    contentClassName?: string;

    [key: string]: any;
}

export interface IListViewProps extends Omit<IListProps, 'onFetch'>, Omit<IListOutput, 'list'> {
    content: any,
}

export interface IListItemViewProps {
    id: PrimaryKey,
    primaryKey: PrimaryKey,
    item: {
        id?: PrimaryKey,
        title?: string | any,
        label?: string | any,
        [key: string]: any,
    },
    index: number,
    className?: CssClassName;
    contentClassName?: string;
    layoutSelected?: PrimaryKey;
}

export default function List(props: IListProps): JSX.Element {
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
        onError: props.onError,
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

    const ItemView = props.itemView || components.ui.getView('list.ListItemView');
    const content = (list?.items || []).map((item, index) => (
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
        //onFetch,
        //onSort,
        content,
    });
}
