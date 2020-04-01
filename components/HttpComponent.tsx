import * as React from 'react';
import _trimStart from 'lodash-es/trimStart';
import _trimEnd from 'lodash-es/trimEnd';
import {setFlashes} from '../actions/notifications';
import axios from 'axios';

export default class HttpComponent {
    accessTokenKey = 'accessToken';
    apiUrl: string;

    _accessToken: any;
    _axios: any;
    _components: any;
    _csrfToken: any;
    _lazyRequests: any;
    _promises: any;

    constructor(components) {
        this._components = components;
        this.apiUrl = typeof location !== 'undefined'
            ? location.protocol + '//' + location.host : (process.env.BACKEND_URL || '');
        this.accessTokenKey = 'accessToken';
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
        if (!this._csrfToken && !process.env.IS_SSR && process.env.PLATFORM === 'web') {
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
            this._accessToken =
                await clientStorage.get(this.accessTokenKey, clientStorage.STORAGE_COOKIE) ||
                await clientStorage.get(this.accessTokenKey) ||
                null;
            if (this._accessToken) {
                await clientStorage.set(
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

    get(url, params = {}, options = {}) {
        return this._send(
            url,
            {
                method: 'get',
                params: params
            },
            options
        ).then(response => response.data);
    }

    post(url, params = {}, options = {}) {
        return this._send(
            url,
            {
                method: 'post',
                data: params
            },
            options
        ).then(response => response.data);
    }

    delete(url, params = {}, options = {}) {
        return this._send(
            url,
            {
                method: 'delete',
                data: params
            },
            options
        ).then(response => response.data);
    }

    send(method, url, params = {}, options = {}) {
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

    _send(method, config, options) {
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
                this._lazyRequests[method] = setTimeout(() => {
                    this._sendAxios(axiosConfig)
                        .then(result => resolve(result))
                        .catch(result => reject(result));
                }, timeout);
            });
        }
        return this._sendAxios(axiosConfig);
    }

    _sendAxios(config) {
        const promise = this.getAxiosInstance().then(instance =>
            instance(config)
            .then(response => {
                this.afterRequest(response);
                return response;
            })
            .catch(error => {
                console.error('Error, request/response: ', config, String(error)); // eslint-disable-line no-console
                throw error;
            })
        );

        // Store promises for SSR
        if (process.env.IS_SSR) {
            this._promises.push(promise);
        }
        return promise;
    }

    afterRequest(response) {
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
    }
}
