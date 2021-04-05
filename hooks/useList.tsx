import {ReactChildren, useCallback, useEffect, useMemo} from 'react';
import _get from 'lodash-es/get';
import _union from 'lodash-es/union';
import _isEqual from 'lodash-es/isEqual';
import * as React from 'react';
import useSelector from '@steroidsjs/core/hooks/useSelector';
import {getList} from '@steroidsjs/core/reducers/list';
import useModel from '@steroidsjs/core/hooks/useModel';
import useAddressBar from '@steroidsjs/core/hooks/useAddressBar';
import {IList, listDestroy, listFetch, listInit, listLazyFetch, listSetItems} from '@steroidsjs/core/actions/list';
import {useMount, usePrevious, useUnmount, useUpdateEffect} from 'react-use';
import useDispatch from '@steroidsjs/core/hooks/useDispatch';
import {formChange} from '@steroidsjs/core/actions/form';
import {formSelector} from '@steroidsjs/core/reducers/form';
import {ILayoutNamesProps, normalizeLayoutNamesProps} from '@steroidsjs/core/ui/list/LayoutNames/LayoutNames';
import useInitial from '@steroidsjs/core/hooks/useInitial';
import {IPaginationProps, normalizePaginationProps} from '../ui/list/Pagination/Pagination';
import {IPaginationSizeProps, normalizePaginationSizeProps} from '../ui/list/PaginationSize/PaginationSize';
import {IEmptyProps, normalizeEmptyProps} from '../ui/list/Empty/Empty';
import {IFormProps} from '../ui/form/Form/Form';
import {Model} from '../components/MetaComponent';

export type ListControlPosition = 'top' | 'bottom' | 'both' | string;

interface ISortProps {
    enable?: boolean,
    attribute?: string,
    defaultValue?: string | string[] | null,
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
    layout?: boolean | ILayoutNamesProps,
    empty?: boolean | string | IEmptyProps,
    searchForm?: Omit<IFormProps, 'formId'> & {
        formId?: string,
    },
    autoDestroy?: boolean,
    onFetch?: (list: IList, query: Record<string, unknown>, http: any) => Promise<any>,
    condition?: (query: Record<string, unknown>) => any[],
    addressBar?: boolean | IAddressBar,
    scope?: string[],
    query?: Record<string, unknown>,
    model?: Model,
    searchModel?: Model,
    items?: Array<any>,
}

export interface IListOutput {
    list : IList,
    model: Model,
    searchModel: Model,
    paginationPosition: ListControlPosition,
    paginationSizePosition: ListControlPosition,
    layoutNamesPosition: ListControlPosition,
    renderList: (children: any) => any,
    renderEmpty: () => any,
    renderPagination: () => any,
    renderPaginationSize: () => any,
    renderLayoutNames: () => any,
    renderSearchForm: () => any,
    onFetch: (params?: Record<string, unknown>) => void,
    onSort: (value: any) => void,
}

const defaultConfig = {
    actionMethod: 'get',
    primaryKey: 'id',
    autoDestroy: true,
    sort: {
        enable: false,
        attribute: 'sort',
        defaultValue: null,
    },
    addressBar: {
        enable: false,
        useHash: false,
    },
};

export default function useList(config: IListConfig): IListOutput {
    // Get list from redux state
    const list = useSelector(state => getList(state, config.listId));

    // Normalize sort config
    const sort = useMemo(() => ({
        ...defaultConfig.sort,
        enable: !!config.sort,
        ...(typeof config.sort === 'boolean' ? {enable: config.sort} : config.sort),
    }), [config.sort]);

    // Empty
    const Empty = require('../ui/list/Empty').default;
    const emptyProps = normalizeEmptyProps(config.empty);
    const renderEmpty = () => <Empty list={list} {...emptyProps} />;

    // Pagination size
    const PaginationSize = require('../ui/list/PaginationSize').default;
    const paginationSizeProps = normalizePaginationSizeProps(config.paginationSize);
    const renderPaginationSize = () => (
        <PaginationSize
            list={list}
            {...paginationSizeProps}
        />
    );

    // Pagination
    const Pagination = require('../ui/list/Pagination').default;
    const paginationProps = normalizePaginationProps(config.pagination);
    const renderPagination = () => (
        <Pagination
            list={list}
            {...paginationProps}
            sizeAttribute={paginationSizeProps.attribute}
        />
    );

    // Layout switcher
    const LayoutNames = require('../ui/list/LayoutNames').default;
    const layoutNamesProps = normalizeLayoutNamesProps(config.layout);
    const renderLayoutNames = () => <LayoutNames list={list} {...layoutNamesProps} />;

    // Models
    const model = useModel(config.model);
    const searchModel = useModel(config.searchForm?.model, {
        attributes: [ // default attributes
            paginationProps.enable && {
                type: 'number',
                attribute: paginationProps.attribute,
                defaultValue: paginationProps.defaultValue,
            },
            paginationSizeProps.enable && {
                type: 'number',
                attribute: paginationSizeProps.attribute,
                defaultValue: paginationSizeProps.defaultValue,
            },
            sort.enable && {
                type: 'string', // TODO Need list of strings
                jsType: 'string[]',
                attribute: sort.attribute,
                defaultValue: sort.defaultValue,
            },
            layoutNamesProps.enable && {
                type: 'string',
                attribute: layoutNamesProps.attribute,
                defaultValue: layoutNamesProps.defaultValue,
            },
        ].filter(Boolean),
    });

    // Address bar synchronization
    const {initialQuery, updateQuery} = useAddressBar({
        enable: !!config.addressBar,
        model: searchModel,
        ...(typeof config.addressBar === 'boolean' ? {enable: config.addressBar} : config.addressBar),
    });

    // Outside search form
    const SearchForm = require('../ui/list/SearchForm').default;
    const initialValuesSearchForm = useMemo(() => {
        return (config.searchForm?.fields || []).reduce((acc, field) => {
            const attribute = typeof field === 'string' ? field : field.attribute;
            acc[attribute] = initialQuery?.[attribute];
            return acc;
        }, {})
    }, [config.searchForm?.fields, initialQuery]);

    const searchFormProps = {
        listId: config.listId,
        ...config.searchForm,
        model: searchModel,
        initialValues: initialValuesSearchForm
    };

    const renderSearchForm = () => <SearchForm {...searchFormProps} />;

    // Form id
    const formId = _get(config, 'searchForm.formId') || config.listId;
    const dispatch = useDispatch();

    // List wrapper (form context)
    const initialValues = useInitial(() => ({
        [paginationProps.attribute]: paginationProps.defaultValue,
        [paginationSizeProps.attribute]: paginationSizeProps.defaultValue,
        [sort.attribute]: sort.defaultValue,
        [layoutNamesProps.attribute]: layoutNamesProps.defaultValue,
        // TODO [this.props._layout.attribute]:
        //  this.props.clientStorage.get(this.props._layout.attribute) || this.props._layout.defaultValue,
        ...initialQuery, // Address bar
        ...config.query, // Query from props
    }));

    const renderList = useCallback((children: any) => {
        const Form = require('../ui/form/Form').default;
        return (
            <Form
                formId={formId}
                initialValues={initialValues}
                view={false}
                useRedux
            >
                {children}
            </Form>
        );
    }, [formId, initialValues]);

    // Init list in redux store
    useMount(() => {
        dispatch(listInit(config.listId, {
            listId: config.listId,
            action: config.action || null,
            actionMethod: config.actionMethod || defaultConfig.actionMethod,
            onFetch: config.onFetch,
            condition: config.condition,
            scope: config.scope,
            items: null,
            sourceItems: config.items || null,
            isRemote: !config.items,
            primaryKey: config.primaryKey,
            formId,
            loadMore: paginationProps.loadMore,
            pageAttribute: paginationProps.attribute || null,
            pageSizeAttribute: paginationSizeProps.attribute || null,
            sortAttribute: sort.attribute || null,
            layoutAttribute: layoutNamesProps.attribute || null,
        }));
    });

    // Check form values change
    const formValues = useSelector(state => formSelector(state, formId, ({values}) => values));
    const prevFormValues = usePrevious(formValues);

    useUpdateEffect(() => {
        if (!_isEqual(formValues, prevFormValues)) {
            // Has changes (but not page) -> reset page
            const attribute = paginationProps.attribute;

            if (prevFormValues?.[attribute] === formValues[attribute] && formValues[attribute] > 1) {
                formValues[attribute] = paginationProps.defaultValue;
                dispatch(formChange(formId, attribute, formValues[attribute]));
            }

            // Sync with address bar
            updateQuery(formValues);

            // Send request
            dispatch(listLazyFetch(config.listId));
        }
    }, [dispatch, formId, formValues, paginationProps.attribute, paginationProps.defaultValue, prevFormValues]);

    // Check change query
    const prevQuery = usePrevious(config.query);
    useUpdateEffect(() => {
        _union(Object.keys(prevQuery), Object.keys(config.query)).forEach(key => {
            if (_isEqual(prevQuery[key], config.query[key])) {
                dispatch(formChange(formId, key, config.query[key]));
            }
        });
    }, [formId, prevQuery, config.query, dispatch]);

    // Check change items
    useEffect(() => {
        dispatch([
            listSetItems(config.listId, config.items),
            listLazyFetch(config.listId),
        ]);
    }, [dispatch, config.items, config.listId]);

    // Destroy
    useUnmount(() => {
        if (config.autoDestroy) {
            dispatch(listDestroy(config.listId));
        }
    });

    const onFetch = useCallback((params = {}) => {
        dispatch(listFetch(config.listId, params));
    }, [config.listId, dispatch]);

    const onSort = useCallback((value) => {
        dispatch(formChange(formId, sort.attribute, value));
    }, [dispatch, formId, sort.attribute]);

    return {
        list,
        model,
        searchModel,
        paginationPosition: paginationProps.position,
        paginationSizePosition: paginationSizeProps.position,
        layoutNamesPosition: layoutNamesProps.position,
        renderList,
        renderEmpty,
        renderPagination,
        renderPaginationSize,
        renderLayoutNames,
        renderSearchForm,
        onFetch,
        onSort,
    };
}
