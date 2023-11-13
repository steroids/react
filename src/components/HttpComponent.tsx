import * as React from 'react';
import _trimStart from 'lodash-es/trimStart';
import _trimEnd from 'lodash-es/trimEnd';
import _isEmpty from 'lodash-es/isEmpty';
import setCookie from 'set-cookie-parser';
import axios from 'axios';
import {setFlashes} from '../actions/notifications';

interface IHttpRequestOptions {
    lazy?: boolean | number,
    cancelToken?: any,
    onTwoFactor?: (providerName: string) => Promise<any>,
    responseType?: string,
}

export interface IHttpComponentConfig {
    /**
     * Url для http запросов
     */
    apiUrl?: string,

    /**
     * Ключ для хранения токена в куках
     */
    accessTokenKey?: string,

    /**
     * Имя хранилища для токена (local, session, или cookie)
     */
    clientStorageName?: string,

    /**
     * Срок хранения токена в хранилище в днях
     */
    clientStorageExpiresIn?: number,
}

export interface IHttpComponent extends IHttpComponentConfig {
    /**
     * Получение конфига для axios
     * @returns Конфиг для axios
     */
    getAxiosConfig(): Promise<any>;

    /**
     * Изменение csrf токена
     * @param {string} value
     */
    setCsrfToken(value: string): void;

    /**
     * Удаление токена
     */
    removeAccessToken(): void;

    /**
     * Изменение токена
     * @param {string} value
     */
    setAccessToken(value: string): any;

    /**
     * Получение токена
     * @returns {string}
     */
    getAccessToken(): Promise<any>;

    /**
     * Сбросить конфиг
     */
    resetConfig(): void;

    /**
     * Метод, который можно вызвать при logout
     */
    onLogout(): void;

    /**
     * Метод, который можно вызвать при login
     * @param {{accessToken: string}} params
     */
    onLogin(params: {accessToken: string}): void;

    /**
     * Получение url по методу
     * @param {string} method
     * @returns {string} url
     */
    getUrl(method: string): string;

    /**
     * Получение экземпляра axios
     * @returns Экземпляр axios
     */
    getAxiosInstance(): Promise<any>;

    /**
     * Вызов метода get
     */
    get(url: string, params?: Record<string, any>, options?: IHttpRequestOptions): any;

    /**
     * Вызов метода post
     */
    post(url: string, params?: Record<string, any>, options?: IHttpRequestOptions): any;

    /**
     * Вызов метода delete
     */
    delete(url: string, params?: Record<string, any>, options?: IHttpRequestOptions): any;

    /**
     * Вызов http-метода
     */
    send(method: string, url: string, params?: Record<string, any>, options?: IHttpRequestOptions): any;

    /**
     * Метод, который вызывается после запроса
     */
    afterRequest(response: any, config: Record<string, any>, options: IHttpRequestOptions): Promise<any>;

    [key: string]: any,
}

/**
 * Http Component
 * Обертка над Axios для запросов на бекенд. Поддерживает токен авторизации, CSRF и обработку ошибок.
 */
export default class HttpComponent implements IHttpComponent {
    accessTokenKey? = 'accessToken';

    apiUrl?: string;

    clientStorageName?: string;

    clientStorageExpiresIn?: number;

    _accessToken: any;

    _axios: any;

    _components: any;

    _csrfToken: any;

    _lazyRequests: any;

    _promises: any;

    _isWindowAvailable: boolean;

    constructor(components, config: any = {}) {
        this._components = components;

        this._isWindowAvailable = !process.env.IS_SSR && process.env.PLATFORM !== 'mobile';
        this.apiUrl = config.apiUrl
            //|| process.env.APP_BACKEND_URL
            || (this._isWindowAvailable ? window.location.protocol + '//' + window.location.host : '');
        this.accessTokenKey = config.accessTokenKey || 'accessToken';
        this.clientStorageName = config.clientStorageName || this._components.clientStorage.STORAGE_COOKIE;
        this.clientStorageExpiresIn = config.clientStorageExpiresIn || 180;

        this._lazyRequests = {};
        this._axios = null;
        this._csrfToken = null;
        this._accessToken = false;
    }

    async getAxiosConfig() {
        const config = {
            withCredentials: true,
            headers: {
                // Add XMLHttpRequest header for detect ajax requests
                'X-Requested-With': 'XMLHttpRequest',
                // Add Content-Type
                'Content-Type': 'application/json',
            } as any,
        };
        // Add CSRF header
        if (!this._csrfToken && !process.env.IS_SSR && process.env.IS_WEB) {
            const metaElement = document.querySelector('meta[name=csrf-token]');
            if (metaElement) {
                this._csrfToken = metaElement.getAttribute('content');
            }
        }
        if (this._csrfToken) {
            config.headers['X-CSRF-Token'] = this._csrfToken;
        }
        // Set access token
        if (this._accessToken === false) {
            const clientStorage = this._components.clientStorage;
            const tokenValue = clientStorage.get(this.accessTokenKey, this.clientStorageName)
                || clientStorage.get(this.accessTokenKey)
                || null;

            // client storage method 'get' could be asynchronous
            this._accessToken = tokenValue instanceof Promise
                ? await tokenValue
                : tokenValue;

            if (this._accessToken) {
                clientStorage.set(
                    this.accessTokenKey,
                    this._accessToken,
                    this.clientStorageName,
                    this.clientStorageExpiresIn,
                );
            }
        }
        if (this._accessToken) {
            config.headers.Authorization = 'Bearer ' + this._accessToken;
        }
        return config;
    }

    setCsrfToken(value: string) {
        this._csrfToken = value;
        this.resetConfig();
    }

    removeAccessToken() {
        this._accessToken = null;
        this.resetConfig();
        this._components.clientStorage.remove(
            this.accessTokenKey,
            this.clientStorageName,
        );
    }

    setAccessToken(value: string) {
        this._accessToken = value;
        this.resetConfig();
        this._components.clientStorage.set(
            this.accessTokenKey,
            value,
            this.clientStorageName,
            this.clientStorageExpiresIn,
        );
    }

    async getAccessToken() {
        if (this._accessToken === false) {
            this._accessToken = await this._components.clientStorage.get(
                this.accessTokenKey,
                this.clientStorageName,
            ) || null;
        }
        return this._accessToken;
    }

    resetConfig() {
        this._axios = null;
    }

    onLogout() {
        this.removeAccessToken();
    }

    onLogin(params: {
        accessToken: string,
    }) {
        this.setAccessToken(params.accessToken);
    }

    async getAxiosInstance() {
        if (!this._axios) {
            this._axios = axios.create(await this.getAxiosConfig());
        }
        return this._axios;
    }

    getUrl(method: string) {
        if (method === null && this._isWindowAvailable) {
            method = window.location.pathname;
        }
        if (method.indexOf('://') === -1) {
            method = `${_trimEnd(this.apiUrl, '/')}/${_trimStart(method, '/')}`;
        }
        return method;
    }

    get(url, params = {}, options: IHttpRequestOptions = {}) {
        return this._send(
            url,
            {
                method: 'get',
                params,
            },
            options,
        ).then((response: any) => response.data);
    }

    post(url, params = {}, options: IHttpRequestOptions = {}) {
        return this._send(
            url,
            {
                method: 'post',
                data: params,
            },
            options,
        ).then((response: any) => response.data);
    }

    delete(url, params = {}, options: IHttpRequestOptions = {}) {
        return this._send(
            url,
            {
                method: 'delete',
                data: params,
            },
            options,
        ).then((response: any) => response.data);
    }

    send(method, url, params = {}, options: IHttpRequestOptions = {}) {
        method = method.toLowerCase();
        return this._send(
            url,
            {
                method,
                [method === 'get' ? 'params' : 'data']: params,
            },
            options,
        );
    }

    protected _send(method, config, options: IHttpRequestOptions) {
        const axiosConfig = {
            ...config,
            url: this.getUrl(method),
        };
        // Manual send cookies for preload data in ssr
        if (process.env.IS_SSR && axiosConfig.url.indexOf(this.apiUrl) !== -1) {
            const {clientStorage} = this._components;
            axiosConfig.headers = {
                ...axiosConfig.headers,
                Cookie: Object
                    .entries(clientStorage.get(null, clientStorage.STORAGE_COOKIE) || {})
                    .map(([key, value]) => `${key}=${value}`)
                    .concat([axiosConfig.headers?.Cookie])
                    .filter(Boolean)
                    .join(';'),
            };
        }
        if (options.cancelToken) {
            axiosConfig.cancelToken = options.cancelToken;
        }
        if (options.responseType) {
            axiosConfig.responseType = options.responseType;
        }
        if (options.lazy) {
            if (this._lazyRequests[method]) {
                clearTimeout(this._lazyRequests[method]);
            }
            return new Promise((resolve, reject) => {
                const timeout = options.lazy !== true ? options.lazy : 200;
                if (typeof timeout === 'number') {
                    this._lazyRequests[method] = setTimeout(() => {
                        this._sendAxios(axiosConfig, options)
                            .then(result => resolve(result))
                            .catch(result => reject(result));
                    }, timeout);
                }
            });
        }
        return this._sendAxios(axiosConfig, options);
    }

    protected _sendAxios(config, options: IHttpRequestOptions) {
        return this.getAxiosInstance()
            .then(instance => instance(config))
            .then(response => this.afterRequest(response, config, options).then(newResponse => newResponse || response))
            .catch(error => {
                console.error('Error, request/response: ', config, String(error)); // eslint-disable-line no-console
                throw error;
            });
    }

    async afterRequest(response, config, options: IHttpRequestOptions) {
        const {store, clientStorage} = this._components;

        // Manual set cookies for ssr
        const cookie = response.headers['set-cookie'];
        if (process.env.IS_SSR && config.url.indexOf(this.apiUrl) !== -1 && !_isEmpty(cookie)) {
            setCookie.parse(cookie).forEach(({name, value, expires}) => (
                clientStorage.set(name, value, clientStorage.STORAGE_COOKIE, expires)
            ));
        }

        // Flash
        if (response.data.flashes) {
            store.dispatch(setFlashes(response.data.flashes));
        }

        // Ajax redirect
        if (response.data.redirectUrl && this._isWindowAvailable) {
            if (window.location.href === response.data.redirectUrl.split('#')[0]) {
                window.location.href = response.data.redirectUrl;
                window.location.reload();
            } else {
                window.location.href = response.data.redirectUrl;
            }
        }

        // 2fa
        // {"errors":{"amount":["2FA_REQUIRED:notifier"]}}
        if (response.data.errors) {
            const match = JSON.stringify(response.data.errors).match(/2FA_REQUIRED:([a-zA-Z0-9-_]+)/);
            if (match) {
                const providerName = match[1];

                // Mark 2fa, remove errors - only 2fa need
                response.twoFactor = providerName;
                delete response.data.errors;

                if (options.onTwoFactor) {
                    await options.onTwoFactor(providerName);
                } else {
                    // Require verification code
                    await this._onTwoFactor(providerName);

                    // Retry request
                    return this._sendAxios(config, options);
                }
            }
        }

        return response;
    }

    protected _onTwoFactor(providerName) {
        return new Promise((resolve) => {
            const store = this._components.store;
            const TwoFactorModal = require('../ui/modal/TwoFactorModal').default;
            const {openModal} = require('../actions/modal');
            store.dispatch(openModal(TwoFactorModal, {
                providerName,
                onClose: resolve,
            }));
        });
    }
}
