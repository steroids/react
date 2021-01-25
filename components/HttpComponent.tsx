import * as React from 'react';
import _trimStart from 'lodash-es/trimStart';
import _trimEnd from 'lodash-es/trimEnd';
import {setFlashes} from '../actions/notifications';
import axios from 'axios';

interface IHttpRequestOptions {
    lazy?: boolean | number,
    cancelToken?: any,
    onTwoFactor?: (providerName: string) => Promise<any>
}

/**
 * Http Component
 * Обертка над Axios для запросов на бекенд. Поддерживает токен авторизации, CSRF и обработку ошибок.
 */
export default class HttpComponent {
    accessTokenKey = 'accessToken';
    apiUrl: string;

    _accessToken: any;
    _axios: any;
    _components: any;
    _csrfToken: any;
    _lazyRequests: any;
    _promises: any;

    constructor(components, config: any = {}) {
        this._components = components;

        this.apiUrl = config.apiUrl
            //|| process.env.APP_BACKEND_URL
            || (typeof location !== 'undefined' ? location.protocol + '//' + location.host : '');
        this.accessTokenKey = config.accessTokenKey || 'accessToken';

        this._lazyRequests = {};
        this._axios = null;
        this._csrfToken = null;
        this._accessToken = false;
        this._promises = [];
    }

    async getAxiosConfig() {
        const config = {
            withCredentials: true,
            headers: {
                // Add XMLHttpRequest header for detect ajax requests
                'X-Requested-With': 'XMLHttpRequest',
                // Add Content-Type
                'Content-Type': 'application/json'
            }
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
            const tokenValue =
                clientStorage.get(this.accessTokenKey, clientStorage.STORAGE_COOKIE) ||
                clientStorage.get(this.accessTokenKey) ||
                null;

            // client storage method 'get' could be asynchronous
            this._accessToken = tokenValue instanceof Promise
                ? await tokenValue
                : tokenValue;

            if (this._accessToken) {
                clientStorage.set(
                    this.accessTokenKey,
                    this._accessToken,
                    clientStorage.STORAGE_COOKIE,
                    180
                );
            }
        }
        if (this._accessToken) {
            config.headers['Authorization'] = 'Bearer ' + this._accessToken;
        }
        return config;
    }

    /**
     * @param {string} value
     */
    setCsrfToken(value) {
        this._csrfToken = value;
        this.resetConfig();
    }

    removeAccessToken() {
        this._accessToken = null;
        this.resetConfig();
        this._components.clientStorage.remove(
            this.accessTokenKey,
            this._components.clientStorage.STORAGE_COOKIE,
        );
    }

    /**
     * @param {string} value
     */
    setAccessToken(value) {
        this._accessToken = value;
        this.resetConfig();
        this._components.clientStorage.set(
            this.accessTokenKey,
            value,
            this._components.clientStorage.STORAGE_COOKIE,
            180
        );
    }

    /**
     * @returns {string}
     */
    async getAccessToken() {
        if (this._accessToken === false) {
            this._accessToken =
                await this._components.clientStorage.get(this.accessTokenKey) || null;
        }
        return this._accessToken;
    }

    resetConfig() {
        this._axios = null;
    }

    async getAxiosInstance() {
        if (!this._axios) {
            this._axios = axios.create(await this.getAxiosConfig());
        }
        return this._axios;
    }

    getUrl(method) {
        if (method === null) {
            method = location.pathname;
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
                params: params
            },
            options
        ).then((response: any) => response.data);
    }

    post(url, params = {}, options: IHttpRequestOptions = {}) {
        return this._send(
            url,
            {
                method: 'post',
                data: params
            },
            options
        ).then((response: any) => response.data);
    }

    delete(url, params = {}, options: IHttpRequestOptions = {}) {
        return this._send(
            url,
            {
                method: 'delete',
                data: params
            },
            options
        ).then((response: any) => response.data);
    }

    send(method, url, params = {}, options: IHttpRequestOptions = {}) {
        method = method.toLowerCase();
        return this._send(
            url,
            {
                method,
                [method === 'get' ? 'params' : 'data']: params
            },
            options
        );
    }

    hoc(requestFunc) {
        return require('../hoc/http')(requestFunc);
    }

    _send(method, config, options: IHttpRequestOptions) {
        const axiosConfig = {
            ...config,
            url: this.getUrl(method)
        };
        if (options.cancelToken) {
            axiosConfig.cancelToken = options.cancelToken;
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

    _sendAxios(config, options: IHttpRequestOptions) {
        const promise = this.getAxiosInstance()
            .then(instance => instance(config))
            .then(response => this.afterRequest(response, config, options).then(newResponse => newResponse || response))
            .catch(error => {
                console.error('Error, request/response: ', config, String(error)); // eslint-disable-line no-console
                throw error;
            });

        // Store promises for SSR
        if (process.env.IS_SSR) {
            this._promises.push(promise);
        }
        return promise;
    }

    async afterRequest(response, config, options: IHttpRequestOptions) {
        const store = this._components.store;

        // Flash
        if (response.data.flashes) {
            store.dispatch(setFlashes(response.data.flashes));
        }

        // Ajax redirect
        if (response.data.redirectUrl && !process.env.IS_SSR) {
            if (location.href === response.data.redirectUrl.split('#')[0]) {
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

    _onTwoFactor(providerName) {
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
