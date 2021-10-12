import {useCallback, useRef, useState} from 'react';
import {useUnmount, useUpdateEffect, useEffectOnce} from 'react-use';
import _trim from 'lodash-es/trim';
import axios from 'axios';
import {useComponents, useSsr} from './index';
import {IComponents} from '../providers/ComponentsProvider';
import {IApiMethod} from '../components/ApiComponent';

declare global {
    interface Window {
        APP_PRELOADED_DATA: any
    }
}

export interface IFetchConfig {
    id?: string | number,
    url?: string | IApiMethod,
    method?: 'get' | 'post' | string,
    params?: Record<string, unknown>,
    onFetch?: (config: IFetchConfig, components: IComponents, addCancelToken: (token: any) => any) => any,
}

export interface IFetchResult {
    data?: {
        providerData?: {
            type: string,
            value: string
        },
        [key: string]: unknown
    },
    isLoading: boolean,
    fetch?: (newParams?: Record<string, unknown>) => void,
}

export const normalizeConfig = config => (
    config
        ? {
            id: null,
            url: '',
            method: 'get',
            params: {},
            options: null,
            onFetch: null,
            ...config,
        }
        : null
);

export const getConfigId = config => {
    const result = _trim(config.id || config.url, '/');
    if (!result) {
        // eslint-disable-next-line no-console
        console.warn('Please set id for fetch config, it`s necessary for SSR to work properly');
    }
    return result;
};

export const defaultFetchHandler = (config, components, addCancelToken) => {
    const cancelToken = new axios.CancelToken(cancel => {
        addCancelToken(cancel);
    });

    if (typeof config.url === 'function') {
        return config.url(components.api, config.params, config.options).then(result => result.data);
    }
    return components.http
        .send(config.method, config.url, config.params, {...config.options, cancelToken})
        .then(result => result.data);
};

export const fetchData = (config, components, addCancelToken) => (
    (config.onFetch || defaultFetchHandler).call(null, config, components, addCancelToken)
);

/**
 * Fetch
 * Используется для подгрузки данных с бекенда перед рендером компонента, на котором он применяется.
 * На вход ему передается один или несколько объектов конфигураций (id, key, url, method, params, ...),
 * которые описывают откуда нужно подтянуть данные.
 *
 * В процесс загрузки HOC будет отображать "Загрузка...", а после уже отрендерит компонент, передав данные в указанный
 * ключ `key`.
 */
export default function useFetch(rawConfig: IFetchConfig = null): IFetchResult {
    const components = useComponents();

    // Store config in state
    const [config, setConfig] = useState(normalizeConfig(rawConfig));

    // Update config in state on raw config updated
    useUpdateEffect(() => {
        setConfig(rawConfig);
    }, [rawConfig]);

    // Get preloaded data
    const configId = getConfigId(config);
    const ssrValueContext = useSsr();
    const preloadedData = process.env.IS_SSR ? ssrValueContext.preloadedData : window.APP_PRELOADED_DATA;
    const preloadedDataByConfigId = (preloadedData && configId) ? preloadedData[configId] : null;

    // State for data and loading flag
    const [data, setData] = useState(preloadedDataByConfigId || null);
    const [isLoading, setIsLoading] = useState(!!config && !data);

    // Cancel tokens
    const cancelTokens = useRef([]);
    const addCancelToken = token => cancelTokens.current.push(token);
    useUnmount(() => cancelTokens.current.forEach(cancel => cancel('Canceled on unmount component')));

    // Fetch handler
    const fetch = useCallback(async (newConfig = null) => {
        if (newConfig) {
            setConfig({
                ...config,
                ...newConfig,
                params: {
                    ...config?.params,
                    ...newConfig?.params,
                },
            });
        }

        setData(null);

        if (config) {
            setIsLoading(true);
            setData(await fetchData(config, components, addCancelToken));
            setIsLoading(false);
        }
    }, [components, config]);

    useEffectOnce(() => {
        if (!data) {
            fetch();
        }
    });

    // Fetch data on config update
    useUpdateEffect(() => {
        fetch();
    }, [fetch]);

    return {data, isLoading, fetch};
}
