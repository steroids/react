import * as React from 'react';
import {getFormValues} from 'redux-form';
import _get from 'lodash-es/get';
import _has from 'lodash-es/has';
import _isEqual from 'lodash-es/isEqual';
import _isString from 'lodash-es/isString';
import _isBoolean from 'lodash-es/isBoolean';
import _isArray from 'lodash-es/isArray';
import _isEmpty from 'lodash-es/isEmpty';
import _mergeWith from 'lodash-es/mergeWith';
import * as queryString from 'query-string';

import {init, lazyFetch, fetch, setSort, destroy, setLayoutName, initSSR} from '../actions/list';
import {getList} from '../reducers/list';
import {getMeta} from '../reducers/fields';
import components, {IComponentsHocOutput} from './components';
import connect, {IConnectHocOutput} from './connect';
import normalize, {INormalizeHocConfig} from './normalize';
import {IFormProps} from '../ui/form/Form/Form';
import {IPaginationProps} from '../ui/list/Pagination/Pagination';
import {IPaginationSizeProps} from '../ui/list/PaginationSize/PaginationSize';
import {IEmptyProps} from '../ui/list/Empty/Empty';
import {INavItem} from '../ui/nav/Nav/Nav';

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

export interface IListHocInput {
    /*
    scope: PropTypes.arrayOf(PropTypes.string),
    onFetch: PropTypes.func,
    query: PropTypes.object,
    items: PropTypes.array,
    total: PropTypes.number,
    itemsIndexing: PropTypes.bool,
    syncWithAddressBar: PropTypes.bool,
    restoreCustomizer: PropTypes.func,
    model: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.object
    ]),
     */
    listId?: string,
    pagination?: boolean | IPaginationProps,
    paginationSize?: boolean | IPaginationSizeProps,
    sort?: boolean | ISortProps,
    layout?: boolean | ILayoutProps,
    empty?: boolean | string | IEmptyProps,
    searchForm?: Omit<IFormProps, 'formId'> & {
        formId?: string,
    },
    autoDestroy?: boolean,

    primaryKey?: string,
    action?: string,
    actionMethod?: HttpMethod,
    scope?: any,
    onFetch?: any,
    query?: any,
    items?: any,
    total?: any,
    itemsIndexing?: any,
    syncWithAddressBar?: any,
    restoreCustomizer?: any,
    model?: any,
    layoutProps?: any,
    locationSearch?: any,
}

export interface IListHocOutput {
    /*
        searchForm={searchForm}
        items={items}
        fetch={this._onFetch}
        sort={this._onSort}
     */
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

export interface IListHocPrivateProps extends IConnectHocOutput, IComponentsHocOutput {
    /*
    list: PropTypes.shape({
        meta: PropTypes.object,
        isFetched: PropTypes.bool,
        isLoading: PropTypes.bool,
        page: PropTypes.number,
        pageSize: PropTypes.number,
        total: PropTypes.number,
        sort: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
        ]),
        query: PropTypes.object,
        items: PropTypes.array
    })
     */
    list?: {
        meta?: object,
        isFetched?: boolean,
        isLoading?: boolean,
        page?: number,
        pageSize?: number,
        total?: number,
        sort?: string | string[],
        query?: object,
        items?: Array<any>,
        layoutName?: string,
    },
    _pagination?: IPaginationProps,
    _paginationSize?: IPaginationSizeProps,
    _sort?: ISortProps,
    _layout?: ILayoutProps,
    _empty?: IEmptyProps,
}

const defaultProps = {
    actionMethod: 'get',
    primaryKey: 'id',
    autoDestroy: true,
    pagination: {
        enable: true,
        attribute: 'page',
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
        enable: false,
        text: 'Записи не найдены',
    }
};

const stateMap = (state, props) => {
    const formId = getFormId(props);
    if (formId && !formValuesSelectors[formId]) {
        formValuesSelectors[formId] = getFormValues(formId);
    }

    const list = getList(state, props.listId);
    let model = props.model || _get(list, 'meta.model');
    if (_isString(model)) {
        model = getMeta(state, model) || null;
    }

    let searchForm = props.searchForm;
    if (searchForm) {
        let searchModel = searchForm.model || _get(list, 'meta.searchModel');
        if (_isString(searchModel)) {
            searchForm.model = {
                fields: {
                    ..._get(getMeta(state, searchModel), 'fields'),
                    ..._get(getMeta(state, searchModel), 'searchFields')
                },
                ...searchForm.model
            };
            if (_isEmpty(searchForm.model)) {
                searchForm.model = null;
            }
        }
    }

    return {
        model,
        searchForm,
        list,
        formValues: (formId && formValuesSelectors[formId](state)) || null,
        locationSearch: _get(state, 'router.location.search', '')
    };
};

const normalizeMap = [
    {
        fromKey: 'pagination',
        toKey: '_pagination',
        normalizer: pagination => ({
            ...defaultProps.pagination,
            ...(_isBoolean(pagination) ? {enable: pagination} : pagination),
        }),
    },
    {
        fromKey: 'paginationSize',
        toKey: '_paginationSize',
        normalizer: paginationSize => ({
            ...defaultProps.paginationSize,
            enable: !!paginationSize,
            defaultValue: _get(paginationSize, 'numbers.0') || 50,
            ...(_isBoolean(paginationSize) ? {enable: paginationSize} : paginationSize),
        }),
    },
    {
        fromKey: 'sort',
        toKey: '_sort',
        normalizer: sort => ({
            ...defaultProps.sort,
            enable: !!sort,
            ...(_isBoolean(sort) ? {enable: sort} : sort),
        }),
    },
    {
        fromKey: 'layout',
        toKey: '_layout',
        normalizer: layout => ({
            ...defaultProps.layout,
            enable: !!layout,
            ...(_isBoolean(layout) ? {enable: layout} : layout),
        }),
    },
    {
        fromKey: 'empty',
        toKey: '_empty',
        normalizer: empty => ({
            ...defaultProps.empty,
            enable: !!empty,
            text: __('Записи не найдены'),
            ...(_isBoolean(empty) ? {enable: empty} : (_isBoolean(empty) ? {text: empty} : empty)),
        }),
    },
] as INormalizeHocConfig[];

let formValuesSelectors = {};
export const getFormId = props =>
    _get(props, 'searchForm.formId', props.listId);

export default (): any => WrappedComponent =>
    connect(stateMap)(
        normalize(normalizeMap)(
            components('store')(
                class ListHoc extends React.PureComponent<IListHocInput & IListHocPrivateProps> {

                    static WrappedComponent = WrappedComponent;

                    static defaultProps = defaultProps;

                    constructor(props) {
                        super(props);
                        this._onFetch = this._onFetch.bind(this);
                        this._onSort = this._onSort.bind(this);
                    }

                    UNSAFE_componentWillMount() {
                        if (process.env.IS_SSR) {
                            const query = queryString.parse(this.props.locationSearch);
                            this.props.dispatch(
                                initSSR(this.props.listId, {
                                    ...this.props,
                                    page: Number(_get(query, 'page', this.props._pagination.defaultValue)),
                                    query
                                })
                            );
                        }
                    }

                    componentDidMount() {
                        // Restore values from address bar
                        if (this.props.syncWithAddressBar) {
                            const page = Number(
                                _get(
                                    queryString.parse(this.props.locationSearch),
                                    'page',
                                    this.props._pagination.defaultValue
                                )
                            );
                            const SyncAddressBarHelper = require('../ui/form/Form/SyncAddressBarHelper').default;
                            SyncAddressBarHelper.restore(
                                this.props.store,
                                this.props.listId,
                                {
                                    ...queryString.parse(this.props.locationSearch),
                                    page: page > 0 ? page : 1
                                },
                                true,
                                this.props.restoreCustomizer
                            );
                        }
                        if (!this.props.list) {
                            this.props.dispatch(init(this.props.listId, this.props));
                        }
                    }

                    UNSAFE_componentWillReceiveProps(nextProps) {
                        const customizer = (objValue, srcValue) => {
                            if (_isArray(objValue)) {
                                return srcValue;
                            }
                        };
                        const getQuery = props => {
                            const query = _get(props, 'list.query') || {};
                            const formValues = _get(props, 'formValues') || {};
                            if (this.props.searchForm) {
                                Object.keys(query).forEach(attribute => {
                                    if (!_has(formValues, attribute)) {
                                        formValues[attribute] = null;
                                    }
                                });
                            }
                            return _mergeWith({}, query, formValues, customizer);
                        };
                        // Send fetch request on change query or init list
                        const prevQuery = getQuery(this.props);
                        let nextQuery = getQuery(nextProps);
                        if (!_isEqual(this.props.query, nextProps.query)) {
                            nextQuery = {...nextQuery, ...nextProps.query};
                        }
                        if (
                            !_isEqual(prevQuery, nextQuery) ||
                            (!this.props.list && nextProps.list)
                        ) {
                            const page = this.props._pagination.enable === true
                                ? Number(_get(nextQuery, 'page', this.props._pagination.defaultValue))
                                : undefined;
                            this.props.dispatch(
                                lazyFetch(this.props.listId, {
                                    page,
                                    ...nextProps.query,
                                    query: nextQuery
                                })
                            );
                            if (this.props.syncWithAddressBar) {
                                const SyncAddressBarHelper = require('../ui/form/Form/SyncAddressBarHelper').default;
                                SyncAddressBarHelper.save(
                                    this.props.store,
                                    {
                                        ...nextQuery,
                                        page: page > 1 && page
                                    },
                                    false
                                );
                            }
                        }
                        if (this.props.items !== nextProps.items) {
                            this.props.dispatch(init(this.props.listId, nextProps));
                        }
                    }

                    componentWillUnmount() {
                        if (this.props.autoDestroy) {
                            this.props.dispatch(destroy(this.props.listId));
                        }
                    }

                    render() {
                        // Check is init
                        if (!this.props.list) {
                            return null;
                        }
                        let items = _get(this.props, 'list.items') || [];
                        // Set 'index' property to items depending on page number
                        if (this.props.itemsIndexing) {
                            items = [].concat(
                                items.map(item => ({
                                    ...item,
                                    index:
                                        items.findIndex(searchItem => searchItem.id === item.id) +
                                        (this.props.list.page > 1 &&
                                            (this.props.list.page - 1) * this.props.list.pageSize) +
                                        1
                                }))
                            );
                        }
                        // Customize model from backend
                        const searchForm = this.props.searchForm
                            ? {
                                ...this.props.searchForm,
                                model:
                                    this.props.searchForm.model ||
                                    _get(this.props.list, 'meta.searchModel')
                            }
                            : null;

                        const outputProps = {
                            isLoading: _get(this.props, 'list.isLoading'),
                            searchForm,
                            items,
                            emptyNode: this.renderEmpty(),
                            paginationNode: this.renderPagination(),
                            paginationPosition: this.props._pagination.position,
                            paginationSizeNode: this.renderPaginationSize(),
                            paginationSizePosition: this.props._paginationSize.position,
                            layoutNode: this.renderLayoutNames(),
                            layoutPosition: this.props._layout.position,
                            layoutSelected: this.props.list.layoutName,
                            outsideSearchFormNode: this.renderOutsideSearchForm(),
                            fetch: this._onFetch,
                            onSort: this._onSort,
                        } as IListHocOutput;

                        return (
                            <WrappedComponent
                                {...this.props}
                                {...outputProps}
                            />
                        );
                    }

                    renderEmpty() {
                        if (this.props.list.isLoading) {
                            return null;
                        }
                        if (!this.props.list.items || this.props.list.items.length > 0) {
                            return null;
                        }
                        if (this.props._empty.enable === false) {
                            return null;
                        }
                        const Empty = require('../ui/list/Empty').default;
                        return (
                            <Empty
                                {...this.props}
                                {...this.props._empty}
                            />
                        );
                    }

                    renderPagination() {
                        if (this.props._pagination.enable === false) {
                            return null;
                        }
                        if (
                            !this.props.list.items ||
                            this.props.list.total <= this.props.list.pageSize
                        ) {
                            return null;
                        }
                        const Pagination = require('../ui/list/Pagination').default;
                        return (
                            <Pagination
                                {...this.props}
                                {...this.props.pagination}
                                syncWithAddressBar={Boolean(
                                    (this.props.searchForm &&
                                        this.props.searchForm.fields &&
                                        this.props.searchForm.syncWithAddressBar) ||
                                    this.props.syncWithAddressBar
                                )}
                            />
                        );
                    }

                    renderPaginationSize() {
                        if (this.props._paginationSize.enable === false) {
                            return null;
                        }
                        if (!this.props.list.items || this.props.list.items.length === 0) {
                            return null;
                        }
                        const PaginationSize = require('../ui/list/PaginationSize').default;
                        return (
                            <div>
                                <PaginationSize
                                    {...this.props}
                                    {...this.props._paginationSize}
                                />
                            </div>
                        );
                    }

                    renderLayoutNames() {
                        if (this.props._layout.enable === false) {
                            return null;
                        }
                        const NavComponent = this.props._layout.view || require('../ui/nav/Nav').default;
                        return (
                            <NavComponent
                                {...this.props._layout}
                                activeTab={this.props.list.layoutName}
                                onChange={layoutName =>
                                    this.props.dispatch(setLayoutName(this.props.listId, layoutName))
                                }
                            />
                        );
                    }

                    renderOutsideSearchForm() {
                        if (!this.props.searchForm || !this.props.searchForm.fields) {
                            return null;
                        }
                        if (this.props.searchForm.layout === 'table') {
                            return null;
                        }
                        if (
                            (this.props.scope || []).includes('model') &&
                            !this.props.list.isFetched
                        ) {
                            return null;
                        }

                        const Form = require('../ui/form/Form').default;

                        return (
                            <Form
                                submitLabel={__('Найти')}
                                {...this.props.searchForm}
                                model={
                                    _get(this.props.searchForm, 'model') ||
                                    _get(this.props.list, 'meta.searchModel')
                                }
                                formId={getFormId(this.props)}
                                onSubmit={() => this._onFetch()}
                            />
                        );
                    }

                    _onFetch(params = {}) {
                        this.props.dispatch(fetch(this.props.listId, params));
                    }

                    _onSort(sort) {
                        this.props.dispatch(setSort(this.props.listId, sort));
                    }
                }
            )
        )
    )
