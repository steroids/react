import * as React from 'react';
import {getFormValues, initialize, change} from 'redux-form';
import _get from 'lodash-es/get';
import _isEqual from 'lodash-es/isEqual';
import _isBoolean from 'lodash-es/isBoolean';
import _isString from 'lodash-es/isString';
import _union from 'lodash-es/union';

import {listInit, listLazyFetch, listFetch, listDestroy, IList} from '../actions/list';
import {getList} from '../reducers/list';
import {getModel} from '../reducers/fields';
import components, {IComponentsHocOutput} from './components';
import connect, {IConnectHocOutput} from './connect';
import normalize, {INormalizeHocConfig} from './normalize';
import {IFormProps} from '../ui/form/Form/Form';
import {IPaginationSizeProps} from '../ui/list/PaginationSize/PaginationSize';
import {IEmptyProps} from '../ui/list/Empty/Empty';
import {INavItem} from '../ui/nav/Nav/Nav';
import {queryReplace, queryRestore} from '../utils/query';
import {IPaginationProps} from '../ui/list/Pagination/Pagination';
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

/**
 * List HOC
 * Добавляет массу возможностей для взаимодействия с коллекциями. Коллекции можно получать как с бекенда, так и передавать
 * статичным массивом. В обоих случаях поддерживается пагинация, сортировка, фильтрация данных. Выбранные фильтры
 * синхронизируются с адресной строкой.
 */
export interface IListHocInput {
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
    onFetch?: (list: IList, query: object, http: any) => Promise<any>,
    addressBar?: boolean | IAddressBar,
    scope?: string[],
    query?: object,
    model?: Model,
    searchModel?: Model,
    items?: Array<any>,
}

export interface IListHocOutput {
    /*
        searchForm={searchForm}
        items={items}
        fetch={this._onFetch}
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
    list?: IList,
    formValues?: any,
    searchFormValues?: any,
    location?: {
        search?: string,
        hash?: string,
        pathname?: string,
    },
    _pagination?: IPaginationProps,
    _paginationSize?: IPaginationSizeProps,
    _sort?: ISortProps,
    _layout?: ILayoutProps,
    _empty?: IEmptyProps,
    _addressBar?: IAddressBar,
    _model?: Model,
    _searchModel?: Model,
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

const stateMap = (state, props) => {
    const list = getList(state, props.listId);
    return {
        list,
        model: getModel(state, props.model || _get(list, 'meta.model')),
        searchModel: getModel(state, _get(props, 'searchModel') || _get(props, 'searchForm.model') || _get(list, 'meta.searchModel')),
        formValues: getFormValues(getFormId(props))(state) || null,
        location: _get(state, 'router.location') || null,
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
            defaultValue: _get(paginationSize, 'sizes.0') || 50,
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
            defaultValue: _get(layout, 'items.0.id') || null,
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
            ...(_isBoolean(empty) ? {enable: empty} : (_isString(empty) ? {text: empty} : empty)),
        }),
    },
    {
        fromKey: 'addressBar',
        toKey: '_addressBar',
        normalizer: addressBar => ({
            ...defaultProps.addressBar,
            enable: !!addressBar,
            ...(_isBoolean(addressBar) ? {enable: addressBar} : addressBar),
        }),
    },
    {
        fromKey: 'model',
        toKey: '_model',
        normalizer: (model, props) => props.meta.normalizeModel(model),
    },
    {
        fromKey: 'searchModel',
        toKey: '_searchModel',
        normalizer: (searchModel, props) => props.meta.normalizeModel(searchModel, props._addressBar.enable && {
            attributes: [ // default attributes
                props._pagination.enable && {
                    type: 'integer',
                    attribute: props._pagination.attribute,
                    defaultValue: props._pagination.defaultValue,
                },
                props._paginationSize.enable && {
                    type: 'integer',
                    attribute: props._paginationSize.attribute,
                    defaultValue: props._paginationSize.defaultValue,
                },
                props._sort.enable && {
                    type: 'string', // TODO Need list of strings
                    jsType: 'string[]',
                    attribute: props._sort.attribute,
                    defaultValue: props._sort.defaultValue,
                },
                props._layout.enable && {
                    type: 'string',
                    attribute: props._layout.attribute,
                    defaultValue: props._layout.defaultValue,
                },
            ].filter(Boolean)
        }),
    },
] as INormalizeHocConfig[];

export const getFormId = props => _get(props, 'searchForm.formId', props.listId);

export default (): any => WrappedComponent =>
    connect(stateMap)(
        components('store', 'meta')(
            normalize(normalizeMap)(
                class ListHoc extends React.PureComponent<IListHocInput & IListHocPrivateProps> {

                    static WrappedComponent = WrappedComponent;

                    static defaultProps = defaultProps;

                    constructor(props) {
                        super(props);

                        this._onFetch = this._onFetch.bind(this);
                        this._onPageChange = this._onPageChange.bind(this);
                        this._onPageSizeChange = this._onPageSizeChange.bind(this);
                        this._onSortChange = this._onSortChange.bind(this);
                        this._onLayoutChange = this._onLayoutChange.bind(this);
                    }

                    UNSAFE_componentWillMount() {
                        // TODO
                        /*if (process.env.IS_SSR) {
                            const query = queryString.parse(this.props.locationSearch);
                            this.props.dispatch(
                                initSSR(this.props.listId, {
                                    ...this.props,
                                    page: Number(_get(query, 'page', this.props._pagination.defaultValue)),
                                    query
                                })
                            );
                        }*/
                    }

                    componentDidMount() {
                        if (!this.props.list) {
                            let initialValues: any = {
                                [this.props._pagination.attribute]: this.props._pagination.defaultValue,
                                [this.props._paginationSize.attribute]: this.props._paginationSize.defaultValue,
                                [this.props._sort.attribute]: this.props._sort.defaultValue,
                                [this.props._layout.attribute]: this.props._layout.defaultValue,
                            };

                            // Restore from location params (address bar)
                            if (this.props._addressBar.enable && this.props.searchModel) {
                                initialValues = {
                                    ...initialValues,
                                    ...queryRestore(
                                        this.props.searchModel,
                                        this.props.location,
                                        this.props._addressBar.useHash
                                    ),
                                };
                            }

                            // TODO Сейчас обнуляем страницу при обновлении страницы. По хорошему бы
                            // TODO надо добавить поддержку пагинации loadMore не с первой страницы (сейчас глючит)
                            //initialValues.page = 1;

                            // Merge with query from props
                            initialValues = {
                                ...initialValues,
                                ...this.props.query,
                            }

                            this.props.dispatch([
                                listInit(this.props.listId, this.props),
                                initialize(getFormId(this.props), initialValues)
                            ]);
                        }
                    }

                    componentDidUpdate(prevProps, prevState, snapshot) {
                        const toDispatch = [];

                        if (!_isEqual(prevProps.formValues, this.props.formValues)) {
                            const formValues = {...this.props.formValues};

                            // Has changes (but not page) -> reset page
                            const pageAttribute = this.props._pagination.attribute;
                            const prevPage = _get(prevProps, ['formValues', pageAttribute]);
                            const nextPage = _get(this.props, ['formValues', pageAttribute]);
                            if (prevPage && prevPage === nextPage && nextPage > 1) {
                                formValues[pageAttribute] = this.props._pagination.defaultValue;
                                toDispatch.push(change(getFormId(this.props), pageAttribute, formValues[pageAttribute]));
                            }

                            // Send request
                            this.props.dispatch(listLazyFetch(this.props.listId));

                            // Sync with address bar
                            if (this.props._addressBar.enable && this.props.searchModel) {
                                toDispatch.push(queryReplace(
                                    this.props.searchModel,
                                    this.props.location,
                                    formValues,
                                    this.props._addressBar.useHash
                                ));
                            }
                        }

                        // Check change query
                        if (prevProps.query !== this.props.query) {
                            _union(Object.keys(prevProps.query), Object.keys(this.props.query)).forEach(key => {
                                if (_isEqual(prevProps.query[key], this.props.query[key])) {
                                    toDispatch.push(change(getFormId(this.props), key, this.props.query[key]));
                                }
                            });
                        }

                        // Check change items
                        if (prevProps.items !== this.props.items) {
                            toDispatch.push(listInit(this.props.listId, this.props));
                        }

                        this.props.dispatch(toDispatch);
                    }

                    componentWillUnmount() {
                        if (this.props.autoDestroy) {
                            this.props.dispatch(listDestroy(this.props.listId));
                        }
                    }

                    render() {
                        // Check is init
                        if (!this.props.list) {
                            return null;
                        }

                        // Wait load items (if local)
                        if (!this.props.list.isRemote && !this.props.list.items) {
                            return null;
                        }

                        const outputProps = {
                            isLoading: _get(this.props, 'list.isLoading'),
                            searchForm: this.props.searchForm,
                            items: this.props.list.items,
                            emptyNode: this.renderEmpty(),
                            paginationNode: this.renderPagination(),
                            paginationPosition: this.props._pagination.position,
                            paginationSizeNode: this.renderPaginationSize(),
                            paginationSizePosition: this.props._paginationSize.position,
                            layoutNode: this.renderLayoutNames(),
                            layoutPosition: this.props._layout.position,
                            layoutSelected: _get(this.props.formValues, this.props._layout.attribute) || null,
                            outsideSearchFormNode: this.renderOutsideSearchForm(),
                            fetch: this._onFetch,
                            onSort: this._onSortChange,
                        } as IListHocOutput;

                        const Form = require('../ui/form/Form').default;
                        return (
                            <>
                                <Form formId={getFormId(this.props)}/>
                                <WrappedComponent
                                    {...this.props}
                                    {...outputProps}
                                />
                            </>
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
                        const page = _get(this.props.formValues, this.props._pagination.attribute) || null;
                        const pageSize = _get(this.props.formValues, this.props._paginationSize.attribute) || null;
                        if (!page || !pageSize || !this.props.list.items || this.props.list.total <= pageSize) {
                            return null;
                        }

                        const Pagination = require('../ui/list/Pagination').default;
                        return (
                            <Pagination
                                {...this.props}
                                {...this.props.pagination}
                                page={page}
                                pageSize={pageSize}
                                total={this.props.list.total}
                                onChange={this._onPageChange}
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
                                    onChange={this._onPageSizeChange}
                                />
                            </div>
                        );
                    }

                    renderLayoutNames() {
                        if (this.props._layout.enable === false) {
                            return null;
                        }

                        const NavComponent = this.props._layout.view || require('../ui/nav/Nav').default;
                        const layoutName = _get(this.props.formValues, this.props._layout.attribute) || null;
                        return (
                            <NavComponent
                                {...this.props._layout}
                                activeTab={layoutName}
                                onChange={this._onLayoutChange}
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
                        if ((this.props.scope || []).includes('model') && !this.props.list.isFetched) {
                            return null;
                        }

                        const Form = require('../ui/form/Form').default;
                        return (
                            <Form
                                submitLabel={__('Найти')}
                                {...this.props.searchForm}
                                formId={getFormId(this.props)}
                                model={this.props._searchModel}
                                addressBar={false}
                                onSubmit={() => this._onFetch()}
                            />
                        );
                    }

                    _onFetch(params = {}) {
                        this.props.dispatch(listFetch(this.props.listId, params));
                    }

                    _onPageChange(value) {
                        this.props.dispatch(change(getFormId(this.props), this.props._pagination.attribute, value));
                    }

                    _onPageSizeChange(value) {
                        this.props.dispatch(change(getFormId(this.props), this.props._paginationSize.attribute, value));
                    }

                    _onSortChange(value) {
                        this.props.dispatch(change(getFormId(this.props), this.props._sort.attribute, value));
                    }

                    _onLayoutChange(value) {
                        this.props.dispatch(change(getFormId(this.props), this.props._layout.attribute, value));
                    }
                }
            )
        )
    )
