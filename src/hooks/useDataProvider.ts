import {useSelector} from 'react-redux';
import _isString from 'lodash-es/isString';
import _isFunction from 'lodash-es/isFunction';

import {useEffect, useMemo, useRef, useState} from 'react';
import {IApiMethod} from '../components/ApiComponent';
import {normalizeItems} from '../utils/data';
import {useComponents} from './index';
import Enum from '../base/Enum';
import {getEnumLabels} from '../reducers/fields';
import {smartSearch} from '../utils/text';
import {usePrevious} from "react-use";

export interface AutoCompleteConfig {
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
    | ({ new(): Enum })
    | (string | number | { id: string | number | boolean, label: string | any })[];

export interface IDataProviderConfig {
    /**
     * Коллекция элементов
     * @example [{id: 1, label: 'Krasnoyarsk'}, {id: 2, label: 'Moscow'}]
     */
    items?: DataProviderItems,

    /**
     * Конфигурация для подгрузки данных извне.
     * Если dataProvider не передан, то поиск данных по запросу происходит локально.
     */
    dataProvider?: {
        /**
         * URL для подгрузки новой коллекции данных
         * @example '/api/v1/search'
         */
        action?: string | IApiMethod,

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
    },

    /**
     * Текст запроса
     * @example 'some text'
     */
    query?: string,

    /**
     * Настройки поиска
     * @example {enable: true, minLength: 2, delay: 100}
     */
    autoComplete?: boolean | AutoCompleteConfig,

    /**
     * Загрузка данных после любого изменения запроса.
     * Если включен autoFetch, то настройки autoComplete не применятся.
     * @example true
     */
    autoFetch?: boolean,
}

export interface IDataProviderResult {
    items?: {
        id: number | string | boolean,
        label?: string,
        [key: string]: unknown,
    }[];
    sourceItems?: {
        id: number | string | boolean,
        label?: string,
        [key: string]: unknown,
    }[];
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

    // Check enum
    const enumItems = useSelector(state => _isString(config.items) ? getEnumLabels(state, config.items) : null);

    // Initial items
    const initialItems = normalizeItems(enumItems || config.items);

    // Items state
    const [sourceItems, setSourceItems] = useState(initialItems);
    const [items, setItems] = useState(initialItems);
    const [isLoading, setIsLoading] = useState(false);

    // Normalize autoComplete
    const autoComplete: AutoCompleteConfig = useMemo(() => ({
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
    useEffect(() => {
        const fetchRemote = async () => {
            const searchHandler = dataProvider.onSearch || (
                typeof dataProvider.action === 'function'
                    ? (method: any, params) => method(components.api, params).then(response => response.data)
                    : (method: any, params) => components.http.send(dataProvider.actionMethod, method, params)
                        .then(response => response.data)
            );
            const result = searchHandler(dataProvider.action, {
                query: config.query,
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
            }
            setItems(newItems);
        };

        if (!config.dataProvider) {
            // Client-side search on static items
            setItems(config.query ? smartSearch(config.query, sourceItems) : sourceItems);
        } else if (config.autoFetch && isAutoFetchedRef.current === false) {
            isAutoFetchedRef.current = true;
            fetchRemote();
        } else if (autoComplete.enable) {
            if (delayTimerRef.current) {
                clearTimeout(delayTimerRef.current);
            }

            // Changed query logic
            if (prevQuery !== config.query) {
                // Search with delay
                delayTimerRef.current = setTimeout(fetchRemote, autoComplete.delay);
            }
        }
    }, [autoComplete, components.api, components.http, config.autoFetch, config.dataProvider, config.query,
        dataProvider, dataProvider.action, dataProvider.onSearch, sourceItems]);

    return {
        sourceItems,
        items,
        isLoading,
        isAutoComplete: autoComplete.enable,
    };
}
