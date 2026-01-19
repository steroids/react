import {useSelector} from 'react-redux';
import _isString from 'lodash-es/isString';
import _isFunction from 'lodash-es/isFunction';
import _isEqual from 'lodash-es/isEqual';
import _uniqBy from 'lodash-es/uniqBy';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {usePrevious} from 'react-use';
import {fieldsDataProviderSetItems} from '../actions/fields';
import {normalizeItems} from '../utils/data';
import {useComponents, useDispatch} from './index';
import Enum from '../base/Enum';
import {getDataProviderItems, getEnumLabels} from '../reducers/fields';
import {smartSearch} from '../utils/text';

export interface IAutoCompleteConfig {
    /**
     * Подключить autocomplete?
     * @example true
     */
    enable?: boolean,

    /**
     * Минимальная длина запроса
     * @example 2
     */
    minLength?: number,

    /**
     * Задержка в миллисекундах перед осуществлением запроса
     * @example 100
     */
    delay?: number,
}

export type DataProviderItems = string
    | ({new(): Enum,})
    | (string | number | {id: string | number | boolean, label: string | Record<string, any> | number, [key: string]: any, })[];

export interface IDataProvider {
    /**
     * Уникальный (глобально) идентификатор, под которых будут храниться
     * подгруженные данные в redux (при включенном флаге useRedux). Если
     * не задан - данные будут храниться в локальном стейте
     */
    reduxId?: string,

    /**
     * URL для подгрузки новой коллекции данных
     * @example '/api/v1/search'
     */
    action?: string,

    /**
     * Тип HTTP запроса (GET | POST | PUT | DELETE)
     * @example GET
     */
    actionMethod?: HttpMethod,

    /**
     * Параметры запроса
     * @example {pageSize: 3}
     */
    params?: Record<string, unknown>,

    /**
     * Обработчик, который вызывается для подгрузки данных.
     * Если обработчик не передан, то по умолчанию отправится post-запрос.
     * @param {string} action
     * @param {Object} params
     * @return {Promise<Array> | Array}
     */
    onSearch?: (action: string, params: Record<string, unknown>) => Array<unknown> | Promise<Array<unknown>>,

    [key: string]: any,
}

export interface IDataProviderConfig {
    /**
     * Коллекция элементов
     * @example
     * [
     *  {
     *   id: 1,
     *   label: 'Krasnoyarsk'
     *  },
     *  {
     *   id: 2,
     *   label: 'Moscow'
     *  }
     * ]
     */
    items?: DataProviderItems,

    /**
     * Конфигурация для подгрузки данных извне.
     * Если dataProvider не передан, то поиск данных по запросу происходит локально.
     */
    dataProvider?: IDataProvider,

    /**
     * Текст запроса
     * @example 'some text'
     */
    query?: string,

    /**
     * Настройки поиска
     * @example
     * {
     *  enable: true,
     *  minLength: 2,
     *  delay: 100
     * }
     */
    autoComplete?: boolean | IAutoCompleteConfig,

    /**
     * Загрузка данных после любого изменения запроса.
     * Если включен autoFetch, то настройки autoComplete не применятся.
     * @example true
     */
    autoFetch?: boolean,

    /**
     * Идентификаторы выбранных значений, которые необходимо подгрузить при `autoFetch` режиме.
     * На бекенд будут переданы идентификаторы в параметре `ids`, которые необходимо вернуть.
     * Используется только при `autoFetch = true`
     * @example [1, 22]
     */
    initialSelectedIds?: number[],

    /**
     * Сигнал, запрещающий отправку запроса на получение данных
     */
    isFetchDisabled?: boolean,
}

export interface IDataProviderResult {
    fetchRemote: ((isAuto: boolean) => Promise<void>) | null,
    items?: {
        id: number | string | boolean,
        label?: string,
        [key: string]: unknown,
    }[],
    sourceItems?: {
        id: number | string | boolean,
        label?: string,
        [key: string]: unknown,
    }[],
    isLoading?: boolean,
    isAutoComplete?: boolean,
}

const defaultProps = {
    autoComplete: {
        enable: false,
        minLength: 2,
        delay: 100,
    },
};

/**
 * Data Provider
 * Подготавливает коллекции данных для полей форм. Используется в выпадающих списках, чекбоксах, автокомплитах и т.п.
 * Позволяет передать данные несколькими видами (enum, list, object, data provider), а на выход предоставит единый вид
 * данных. Поддерживает загрузку данных извне (при autocomplete), поиск по данным.
 */
export default function useDataProvider(config: IDataProviderConfig): IDataProviderResult {
    const components = useComponents();
    const dispatch = useDispatch();
    const reduxDataProviderId = config.dataProvider?.reduxId;

    // Check enum
    const enumItems = useSelector(state => _isString(config.items) ? getEnumLabels(state, config.items) : null);

    // Initial items
    const initialItems = normalizeItems(enumItems || config.items);

    // Items state
    const [items, setItems] = useState(initialItems);
    const [isLoading, setIsLoading] = useState(false);

    // Source items state (redux or local)
    const [sourceInternalItems, setSourceInternalItems] = useState(initialItems);
    const sourceReduxItems = useSelector(state => getDataProviderItems(state, reduxDataProviderId));
    const sourceItems = reduxDataProviderId ? sourceReduxItems : sourceInternalItems;
    const setSourceItems = useCallback((value) => {
        if (reduxDataProviderId) {
            dispatch(fieldsDataProviderSetItems(reduxDataProviderId, value));
        } else {
            setSourceInternalItems(value);
        }
    }, [reduxDataProviderId, dispatch]);

    // Check change items from props
    const prevInitialItems = usePrevious(initialItems);
    useEffect(() => {
        if (prevInitialItems && !_isEqual(prevInitialItems, initialItems)) {
            setSourceInternalItems(initialItems);
        }
    }, [prevInitialItems, initialItems]);

    // Normalize autoComplete
    const autoComplete: IAutoCompleteConfig = useMemo(() => ({
        ...defaultProps.autoComplete,
        ...(typeof config.autoComplete === 'boolean') ? {enable: config.autoComplete} : config.autoComplete,
    }), [config.autoComplete]);

    const dataProvider = useMemo(() => ({
        action: '',
        actionMethod: 'get',
        params: null,
        onSearch: null,
        ...config.dataProvider,
    }), [config.dataProvider]);

    // Fetch data
    const delayTimerRef = useRef(null);
    const isAutoFetchedRef = useRef(false);
    const prevQuery = usePrevious(config.query);
    const prevParams = usePrevious(dataProvider.params);
    const prevValues = usePrevious(config.initialSelectedIds);
    const prevAction = usePrevious(config?.dataProvider?.action);

    const fetchRemote = useCallback(async (isAuto: boolean) => {
        const searchHandler = dataProvider.onSearch || (
            (method: any, params) => components.http
                .send(dataProvider.actionMethod, method, params)
                .then(response => response.data)
        );
        const result = searchHandler(dataProvider.action, {
            query: config.query,
            ...(isAuto ? {ids: config.initialSelectedIds} : null), // deprecated logic
            ...(config.initialSelectedIds?.length > 0 ? {withIds: config.initialSelectedIds} : null),
            ...config.dataProvider.params,
        });

        // Check is promise
        let newItems;
        if (result && _isFunction(result.then)) {
            setIsLoading(true);
            newItems = await result;
            setIsLoading(false);
        }

        // Update items
        newItems = normalizeItems(newItems);
        if (!config.query) {
            setSourceItems(newItems);
        } else {
            setSourceItems(_uniqBy([
                ...sourceItems,
                ...newItems,
            ], 'id'));
        }
        setItems(newItems);
    }, [components.http, config.dataProvider, config.initialSelectedIds, config.query, dataProvider.action,
        dataProvider.actionMethod, dataProvider.onSearch, setSourceItems, sourceItems]);

    useEffect(() => {
        if (!config.dataProvider) {
            // Client-side search on static items
            setItems(config.query ? smartSearch(config.query, sourceItems) : sourceItems);
            return;
        }

        if (config.isFetchDisabled) {
            return;
        }

        if (config.autoFetch && !isAutoFetchedRef.current) {
            isAutoFetchedRef.current = true;
            fetchRemote(true);
        } else if (!prevValues && !_isEqual(prevValues, config.initialSelectedIds)) {
            fetchRemote(false);
        } else if (autoComplete.enable || (config.autoFetch && isAutoFetchedRef.current)) {
            // Fetch data when action changes
            if (prevAction !== config?.dataProvider?.action) {
                fetchRemote(false);
            }

            // Changed query logic
            if (prevQuery !== config.query || !_isEqual(prevParams, dataProvider.params)) {
                if (delayTimerRef.current) {
                    clearTimeout(delayTimerRef.current);
                }

                // Search with delay
                delayTimerRef.current = setTimeout(() => {
                    fetchRemote(false);
                }, autoComplete.delay);
            }
        }
    }, [autoComplete, components.http, config.autoFetch, config.dataProvider, config.initialSelectedIds, config.query, dataProvider,
        dataProvider.action, dataProvider.onSearch, fetchRemote, prevAction, prevParams, prevQuery, prevValues, setSourceItems, sourceItems,
        config.isFetchDisabled]);

    return {
        fetchRemote: config.dataProvider && fetchRemote,
        sourceItems,
        items,
        isLoading,
        isAutoComplete: autoComplete.enable,
    };
}
