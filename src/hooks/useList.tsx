import {useCallback, useMemo} from 'react';
import _get from 'lodash-es/get';
import _union from 'lodash-es/union';
import _isEqual from 'lodash-es/isEqual';
import * as React from 'react';
import {useMount, usePrevious, useUnmount, useUpdateEffect} from 'react-use';
import {IApiMethod} from '../components/ApiComponent';
import useSelector from '../hooks/useSelector';
import {getList} from '../reducers/list';
import useModel from '../hooks/useModel';
import useAddressBar, {IAddressBarConfig} from '../hooks/useAddressBar';
import {IList, listDestroy, listFetch, listInit, listLazyFetch, listSetItems} from '../actions/list';
import useDispatch from '../hooks/useDispatch';
import {formChange, formDestroy} from '../actions/form';
import {formSelector} from '../reducers/form';
import {ILayoutNamesProps, normalizeLayoutNamesProps} from '../ui/list/LayoutNames/LayoutNames';
import useInitial from '../hooks/useInitial';
import {IPaginationProps, normalizePaginationProps} from '../ui/list/Pagination/Pagination';
import {IPaginationSizeProps, normalizePaginationSizeProps} from '../ui/list/PaginationSize/PaginationSize';
import {IEmptyProps, normalizeEmptyProps} from '../ui/list/Empty/Empty';
import {IFormProps} from '../ui/form/Form/Form';
import {Model} from '../components/MetaComponent';

export type ListControlPosition = 'top' | 'bottom' | 'both' | string;

export interface ISortConfig {
    /**
     * Включить сортировку
     * @example false
     */
    enable?: boolean,

    /**
     * Аттрибут (название) поля сортировки в форме
     * @example sort
     */
    attribute?: string,

    /**
     * Значение сортировки по умолчанию. Нужно указать название свойства, по которому items будут сортироваться,
     * а с помощью знака "-" задать тип сортировки (со знаком минус - сортировать по убыванию, иначе по возрастанию).
     * @example -price
     */
    defaultValue?: string | string[] | null,
}

export interface IListConfig {
    /**
     * Идентификатор списка
     * @example ArticlesList
     */
    listId?: string,

    /**
     * Первичный ключ для item
     * @example id
     */
    primaryKey?: string,

    /**
     * Url, который вернет коллекцию элементов
     * @example api/v1/articles
     */
    action?: string | IApiMethod,

    /**
     * Тип HTTP запроса (GET | POST | PUT | DELETE)
     * @example GET
     */
    actionMethod?: HttpMethod,

    /**
     * Подключение пагинации
     * @example {loadMore: true}
     */
    pagination?: boolean | IPaginationProps,

    /**
     * Переключение количества элементов в списке
     * @example {sizes: [3, 6, 9], defaultValue: 3}
     */
    paginationSize?: boolean | IPaginationSizeProps,

    /**
     * Подключение сортировки
     * @example {enable: true, defaultSort: 'startDate'}
     */
    sort?: boolean | ISortConfig,

    /**
     * Варианты расположения элементов коллекции
     * @example {items: [{id: 'list', label: 'List'}, {id: 'grid', label: 'Grid'}]}
     */
    layout?: boolean | ILayoutNamesProps,

    /**
     * Заглушка в случае отсутствия элементов
     * @example {text: 'Записи не найдены'}
     */
    empty?: boolean | string | IEmptyProps,

    /**
     * Состояние загрузки элементов списка
     * @example false
     */
    isLoading?: boolean,

    /**
     * Форма для поиска элементов
     * @example {fields: ['title'], model: {attributes: ['title:string:Название']}}
     */
    searchForm?: Omit<IFormProps, 'formId'> & {
        formId?: string,
    },

    /**
     * Удаление данных списка из хранилища Redux при размонтировании компонента
     * @example true
     */
    autoDestroy?: boolean,

    /**
     * Отправлять запрос на обновление данных при изменении данных формы. По-умолчанию - включено.
     * @example false
     */
    autoFetchOnFormChanges?: boolean,

    /**
     * Обработчик, который вызывается при изменении значений формы, и нужен для подгрузки новых элементов коллекции
     * @param {IList} list
     * @param {Object} query
     * @param {*} http
     * @return {Promise}
     */
    onFetch?: (list: IList, query: Record<string, unknown>, http: any) => Promise<any>,

    /**
     * Обработчик события ошибки выполнения запроса
     * @param args
     */
    onError?: (error: any) => void;

    /**
     * Обработчик, который составляет список условий для локальной фильтрации элементов коллекции
     * @param {Object} query
     * @return {Array} ['>=', 'age', 18]
     */
    condition?: (query: Record<string, unknown>) => any[],

    /**
     * Синхронизация значений формы списка с адресной строкой
     * @example true
     */
    addressBar?: boolean | IAddressBarConfig,

    /**
    * Параметр для загрузки данных списка с сервера
    */
    scope?: string[],

    /**
     * Дополнительные параметры, значения которых нужно передавать в запросе для получения данных
     * @example {tagName: 'MarketReviews'}
     */
    query?: Record<string, unknown>,

    /**
    * Модель
    */
    model?: string,

    /**
     * Модель для синхронизации значений формы с адресной строкой
     * @example {attributes: [{attribute: 'isMilesAvailable', type: boolean}]}
     */
    searchModel?: string,

    /**
     * Элементы коллекции
     */
    items?: Array<any>,

    /**
     * Начальные элементы. Используется для подгрузки нескольких списков в один запрос, при этом не отменяя пагинацию
     * и последующие запросы на бекенд для 2-й и следующих страниц
     */
    initialItems?: Array<any>,

    /**
     * Количество элементов всего в списке (для отрисовки пагинации), заданное вручную
     */
    initialTotal?: number,
}

export interface IListOutput {
    list: IList,
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

export const defaultConfig = {
    actionMethod: 'get',
    primaryKey: 'id',
    autoDestroy: true,
    sort: {
        enable: false,
        attribute: 'sort',
        defaultValue: null,
    },
};

export const normalizeSortProps = (props: IListConfig['sort']) => ({
    ...defaultConfig.sort,
    enable: !!props,
    ...(typeof props === 'boolean' ? {enable: props} : props),
});

export const getDefaultSearchModel = ({
    paginationProps,
    paginationSizeProps,
    sort,
    layoutNamesProps,
}) => ({
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

export const createInitialValues = ({
    paginationProps,
    paginationSizeProps,
    sort,
    layoutNamesProps,
    initialQuery,
    configQuery,
}) => ({
    [paginationProps.attribute]: paginationProps.defaultValue,
    [paginationSizeProps.attribute]: paginationSizeProps.defaultValue,
    [sort.attribute]: sort.defaultValue,
    [layoutNamesProps.attribute]: layoutNamesProps.defaultValue,
    // TODO [this.props._layout.attribute]:
    //  this.props.clientStorage.get(this.props._layout.attribute) || this.props._layout.defaultValue,
    ...initialQuery, // Address bar
    ...configQuery, // Query from props
});

/**
 * useList
 * Добавляет массу возможностей для взаимодействия с коллекциями. Коллекции можно получать как с бекенда,
 * так и передавать статичным массивом. В обоих случаях поддерживается пагинация, сортировка, фильтрация данных.
 * Выбранные фильтры синхронизируются с адресной строкой.
 */
export default function useList(config: IListConfig): IListOutput {
    // Get list from redux state
    const list = useSelector(state => getList(state, config.listId));

    // Normalize sort config
    const sort = normalizeSortProps(config.sort);

    // Empty
    const Empty = require('../ui/list/Empty').default;
    const emptyProps = normalizeEmptyProps(config.empty);
    const renderEmpty = () => {
        if (!emptyProps.enable || list?.isLoading || list?.items?.length > 0) {
            return null;
        }
        return (
            <Empty
                list={list}
                {...emptyProps}
            />
        );
    };

    // Pagination size
    const PaginationSize = require('../ui/list/PaginationSize').default;
    const paginationSizeProps = normalizePaginationSizeProps(config.paginationSize);
    const renderPaginationSize = () => paginationSizeProps.enable
        ? (
            <PaginationSize
                list={list}
                {...paginationSizeProps}
            />
        )
        : null;

    // Pagination
    const Pagination = require('../ui/list/Pagination').default;
    const paginationProps = normalizePaginationProps(config.pagination);
    const renderPagination = () => paginationProps.enable
        ? (
            <Pagination
                list={list}
                {...paginationProps}
                sizeAttribute={paginationSizeProps.attribute}
            />
        )
        : null;

    // Layout switcher
    const LayoutNames = require('../ui/list/LayoutNames').default;
    const layoutNamesProps = normalizeLayoutNamesProps(config.layout);
    const renderLayoutNames = () => (
        <LayoutNames
            list={list}
            {...layoutNamesProps}
        />
    );

    // Models
    const defaultSearchModel = useMemo(() => getDefaultSearchModel({
        paginationProps,
        paginationSizeProps,
        sort,
        layoutNamesProps,
    }), [layoutNamesProps, paginationProps, paginationSizeProps, sort]);
    const model = useModel(config.model);
    const searchModel = useModel(config.searchModel || config.searchForm?.model, defaultSearchModel);

    // Address bar synchronization
    const {
        initialQuery,
        updateQuery,
    } = useAddressBar({
        enable: !!config.addressBar,
        model: searchModel,
        ...(typeof config.addressBar === 'boolean' ? {enable: config.addressBar} : config.addressBar),
    });

    // Outside search form
    const searchFormFields = config.searchForm?.fields;
    const SearchForm = require('../ui/list/SearchForm').default;
    const initialValuesSearchForm = useMemo(() => (searchFormFields || []).reduce((acc, field) => {
        const attribute = typeof field === 'string' ? field : field.attribute;
        acc[attribute] = initialQuery?.[attribute];
        return acc;
    }, {}), [searchFormFields, initialQuery]);

    const searchFormProps = {
        listId: config.listId,
        ...config.searchForm,
        model: searchModel,
        initialValues: initialValuesSearchForm,
    };

    const renderSearchForm = () => <SearchForm {...searchFormProps} />;

    // Form id
    const formId = _get(config, 'searchForm.formId') || config.listId;
    const dispatch = useDispatch();

    // List wrapper (form context)
    const _initialValues = useMemo(() => createInitialValues({
        paginationProps,
        paginationSizeProps,
        sort,
        layoutNamesProps,
        initialQuery,
        configQuery: config.query,
    }), [config.query, initialQuery, layoutNamesProps, paginationProps, paginationSizeProps, sort]);
    const initialValues = useInitial(() => _initialValues);

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
        if (!list) {
            const toDispatch: any = [
                listInit(config.listId, {
                    listId: config.listId,
                    action: config.action || config.action === '' ? config.action : null,
                    actionMethod: config.actionMethod || defaultConfig.actionMethod,
                    onFetch: config.onFetch,
                    onError: config.onError,
                    condition: config.condition,
                    scope: config.scope,
                    items: null,
                    sourceItems: config.items || null,
                    total: config.initialTotal,
                    isRemote: !config.items,
                    primaryKey: config.primaryKey || defaultConfig.primaryKey,
                    formId,
                    loadMore: paginationProps.loadMore,
                    pageAttribute: paginationProps.attribute || null,
                    pageSizeAttribute: paginationSizeProps.attribute || null,
                    sortAttribute: sort.attribute || null,
                    layoutAttribute: layoutNamesProps.attribute || null,
                }),
            ];

            if (config.initialItems || config.items) {
                toDispatch.push(listSetItems(config.listId, config.initialItems || config.items));
            }
            if (!config.initialItems) {
                toDispatch.push(listLazyFetch(config.listId));
            }

            dispatch(toDispatch);
        }
    });

    // Check form values change
    const formValues = useSelector(state => formSelector(state, formId, ({values}) => values));
    const prevFormValues = usePrevious(formValues);

    useUpdateEffect(() => {
        if (prevFormValues && !_isEqual(formValues, prevFormValues)) {
            // Has changes (but not page) -> reset page
            const attribute = paginationProps.attribute;

            if (prevFormValues?.[attribute] === formValues[attribute] && formValues[attribute] > 1) {
                formValues[attribute] = paginationProps.defaultValue;
                dispatch(formChange(formId, attribute, formValues[attribute]));
            }

            // Sync with address bar
            updateQuery(formValues);

            // Send request
            if (config.autoFetchOnFormChanges !== false) {
                dispatch(listLazyFetch(config.listId));
            }
        }
    }, [config.autoFetchOnFormChanges, config.listId, dispatch, formId, formValues,
        paginationProps.attribute, paginationProps.defaultValue, prevFormValues, updateQuery]);

    // Check change query
    const prevQuery = usePrevious(config.query);
    useUpdateEffect(() => {
        _union(Object.keys(prevQuery), Object.keys(config.query))
            .forEach(key => {
                if (!_isEqual(prevQuery[key], config.query[key])) {
                    dispatch(formChange(formId, key, config.query[key]));
                }
            });
    }, [formId, prevQuery, config.query, dispatch]);

    // Check change items
    useUpdateEffect(() => {
        dispatch([
            listSetItems(config.listId, config.items),
        ]);
    }, [dispatch, config.items, config.listId]);

    // Destroy
    useUnmount(() => {
        const autoDestroy = typeof config.autoDestroy === 'boolean' ? config.autoDestroy : defaultConfig.autoDestroy;
        if (autoDestroy) {
            dispatch([
                listDestroy(config.listId),
                formDestroy(config.listId),
            ]);
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
