import {useMemo} from 'react';
import _get from 'lodash-es/get';
import * as React from 'react';
import useComponents from './useComponents';
import {INavItem} from '../ui/nav/Nav/Nav';
import {IPaginationProps} from '../ui/list/Pagination/Pagination';
import {IPaginationSizeProps} from '../ui/list/PaginationSize/PaginationSize';
import {IEmptyProps} from '../ui/list/Empty/Empty';
import {IFormProps} from '../ui/form/Form/Form';
import {Model} from '../components/MetaComponent';

export type ListControlPosition = 'top' | 'bottom' | 'both' | string;

interface ISortProps {
    enable?: boolean,
    attribute?: string,
    defaultValue?: string | string[] | null,
}

interface ILayoutProps {
    enable?: boolean,
    attribute?: string,
    defaultValue?: string,
    position?: ListControlPosition,
    items?: INavItem[],
    view?: CustomView,
}

interface IAddressBar {
    enable?: boolean,
    useHash?: boolean,
}

export interface IListConfig {
    listId?: string,
    primaryKey?: string,
    action?: string,
    actionMethod?: HttpMethod,
    pagination?: boolean | IPaginationProps,
    paginationSize?: boolean | IPaginationSizeProps,
    sort?: boolean | ISortProps,
    layout?: boolean | ILayoutProps,
    empty?: boolean | string | IEmptyProps,
    searchForm?: Omit<IFormProps, 'formId'> & {
        formId?: string,
    },
    autoDestroy?: boolean,
    onFetch?: (list: IList, query: Record<string, unknown>, http: any) => Promise<any>,
    addressBar?: boolean | IAddressBar,
    scope?: string[],
    query?: Record<string, unknown>,
    model?: Model,
    searchModel?: Model,
    items?: Array<any>,
}

export interface IList {
    isLoading?: boolean,
    emptyNode?: React.ReactNode,
    paginationNode?: React.ReactNode,
    paginationPosition?: ListControlPosition,
    paginationSizeNode?: React.ReactNode,
    paginationSizePosition?: ListControlPosition,
    layoutNode?: React.ReactNode,
    layoutPosition?: ListControlPosition,
    layoutSelected?: PrimaryKey,
    outsideSearchFormNode?: React.ReactNode,
}

const defaultProps = {
    actionMethod: 'get',
    primaryKey: 'id',
    autoDestroy: true,
    pagination: {
        enable: true,
        attribute: 'page',
        aroundCount: 3,
        defaultValue: 1,
        loadMore: false,
        position: 'bottom',
    },
    paginationSize: {
        enable: false,
        attribute: 'pageSize',
        sizes: [30, 50, 100],
        defaultValue: 50,
        position: 'top',
    },
    sort: {
        enable: false,
        attribute: 'sort',
        defaultValue: null,
    },
    layout: {
        enable: false,
        attribute: 'layout',
        defaultValue: null,
        position: 'top',
    },
    empty: {
        enable: true,
        text: 'Записи не найдены',
    },
    addressBar: {
        enable: false,
        useHash: false,
    },
};

export default function useList(config: IListConfig): IList {
    const components = useComponents();

    // Normalize pagination
    const pagination = useMemo(() => ({
        ...defaultProps.pagination,
        ...(typeof config.pagination === 'boolean' ? {enable: config.pagination} : config.pagination),
    }), [config.pagination]);

    // Normalize pagination size
    const paginationSize = useMemo(() => ({
        ...defaultProps.paginationSize,
        enable: !!config.paginationSize,
        defaultValue: _get(config.paginationSize, 'sizes.0') || defaultProps.paginationSize.defaultValue,
        ...(typeof config.paginationSize === 'boolean' ? {enable: config.paginationSize} : config.paginationSize),
    }), [config.paginationSize]);

    // Normalize sort config
    const sort = useMemo(() => ({
        ...defaultProps.sort,
        enable: !!config.sort,
        ...(typeof config.sort === 'boolean' ? {enable: config.sort} : config.sort),
    }), [config.sort]);

    // Normalize layout config
    const layout = useMemo(() => ({
        ...defaultProps.layout,
        enable: !!config.layout,
        defaultValue: _get(config.layout, 'items.0.id') || null,
        ...(typeof config.layout === 'boolean' ? {enable: config.layout} : config.layout),
    }), [config.layout]);

    // Normalize empty view
    const empty = useMemo(() => ({
        ...defaultProps.empty,
        enable: !!config.empty,
        text: __('Записи не найдены'),
        ...(typeof config.empty === 'boolean'
            ? {enable: config.empty}
            : (typeof config.empty === 'string'
                ? {text: config.empty}
                : config.empty
            )
        ),
    }), [config.empty]);

    // Normalize address bar synchronization
    const addressBar = useMemo(() => ({
        ...defaultProps.addressBar,
        enable: !!config.addressBar,
        ...(typeof config.addressBar === 'boolean' ? {enable: config.addressBar} : config.addressBar),
    }), [config.addressBar]);

    // Normalize model
    const model = useMemo(() => components.meta.normalizeModel(config.model), [components.meta, config.model]);

    // Normalize search model
    const searchModel = useMemo(() => components.meta.normalizeModel(searchModel, addressBar.enable && {
        attributes: [ // default attributes
            pagination.enable && {
                type: 'integer',
                attribute: pagination.attribute,
                defaultValue: pagination.defaultValue,
            },
            paginationSize.enable && {
                type: 'integer',
                attribute: paginationSize.attribute,
                defaultValue: paginationSize.defaultValue,
            },
            sort.enable && {
                type: 'string', // TODO Need list of strings
                jsType: 'string[]',
                attribute: sort.attribute,
                defaultValue: sort.defaultValue,
            },
            layout.enable && {
                type: 'string',
                attribute: layout.attribute,
                defaultValue: layout.defaultValue,
            },
        ].filter(Boolean),
    }), [addressBar.enable, components.meta, layout.attribute, layout.defaultValue, layout.enable,
        pagination.attribute, pagination.defaultValue, pagination.enable, paginationSize.attribute,
        paginationSize.defaultValue, paginationSize.enable, sort.attribute, sort.defaultValue, sort.enable]);

    // TODO
    // TODO
    // TODO
    // TODO
    return {} as IList;
}
