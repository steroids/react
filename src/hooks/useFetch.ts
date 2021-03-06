import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useUnmount, useUpdateEffect} from 'react-use';
import axios from 'axios';
import {useComponents} from './index';
import {IComponents} from './useComponents';
import {IApiMethod} from '../components/ApiComponent';

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

const normalizeConfig = config => (
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
const defaultFetchHandler = (config, components, addCancelToken) => {
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

/**
 * Fetch
 * Используется для подгрузки данных с бекенда перед рендером компонента, на котором он применяется.
 * На вход ему передается один или несколько объектов конфигураций (id, key, url, method, params, ...),
 * которые описывают откуда нужно подтянуть данные.
 *
 * В процесс загрузки HOC будет отображать "Загрузка...", а после уже отрендерит компонент, передав данные в указанный
 * ключ `key`. Все данные сохраняются в Redux Store, что позволяет избежать дополнительных запросов при использовании
 * SSR.
 */
export default function useFetch(rawConfig: IFetchConfig = null): IFetchResult {
    const components = useComponents();

    // Store config in state
    const [config, setConfig] = useState(normalizeConfig(rawConfig));

    // Update config in state on raw config updated
    useUpdateEffect(() => {
        setConfig(rawConfig);
    }, [rawConfig]);

    // Resolve config id
    // TODO Get initial state from HttpComponent (for SSR) by configId
    //const idRef = useRef(_uniqueId('fetch'));
    //const configId = config ? _trim(config.id || config.url || idRef.current, '/') : null;

    // State for data and loading flag
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(!!config);

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
        if (config) {
            setIsLoading(true);
            setData(await (config.onFetch || defaultFetchHandler).call(null, config, components, addCancelToken));
            setIsLoading(false);
        }
    }, [components, config]);

    // Fetch data on config update
    useLayoutEffect(() => {
        const fetchData = async () => {
            setData(null);
            if (config) {
                setIsLoading(true);
                setData(await (config.onFetch || defaultFetchHandler).call(null, config, components, addCancelToken));
                setIsLoading(false);
            }
        };

        fetchData();
    }, [components, config]);

    return {data, isLoading, fetch};
}
