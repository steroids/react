import axios from 'axios';
import BaseHttpComponent from '@steroidsjs/core/components/HttpComponent';
import {login, logout} from '@steroidsjs/core/actions/auth';

export default class JwtHttpComponent extends BaseHttpComponent {
    refreshTokenRequest: {
        url: string,
        method: string,
    };

    refreshTokenKey = 'refreshToken';

    _refreshToken: any;

    constructor(components, config: any = {}) {
        super(components, config);
        this.refreshTokenKey = config.refreshTokenKey || 'refreshToken';
        this.refreshTokenRequest = config.refreshTokenRequest;
    }

    async getAxiosConfig() {
        const config = super.getAxiosConfig();
        if (!this._refreshToken) {
            const clientStorage = this._components.clientStorage;
            const tokenValue = clientStorage.get(this.refreshTokenKey, clientStorage.STORAGE_COOKIE)
                || clientStorage.get(this.refreshTokenKey)
                || null;

            this._refreshToken = tokenValue instanceof Promise
                ? await tokenValue
                : tokenValue;

            if (this._refreshToken) {
                clientStorage.set(
                    this.refreshTokenKey,
                    this._refreshToken,
                    clientStorage.STORAGE_COOKIE,
                    180,
                );
            }
        }
        return config;
    }

    private setRefreshTokenInterceptor(axiosInstance) {
        axiosInstance.interceptors.response.use(
            (config) => config,
            async (error) => {
                const originalRequest = error.config;
                if (error.response.status === 401 && error.config && !error.config._isRetry) {
                    const {store} = this._components;

                    const response = await this.send(
                        this.refreshTokenRequest.method,
                        this.refreshTokenRequest.url,
                        {
                            [this.refreshTokenKey]: this._refreshToken,
                        },
                    );
                    const accessToken = response?.data?.[this.accessTokenKey];
                    if (accessToken) {
                        store.dispatch(login(accessToken));

                        originalRequest._isRetry = true;
                        originalRequest.headers.Authorization = 'Bearer ' + accessToken;
                        return axiosInstance.request(originalRequest);
                    } else {
                        store.dispatch(logout());
                    }
                }
                throw error;
            },
        );
    }

    async getAxiosInstance() {
        if (!this._axios) {
            this._axios = axios.create(await this.getAxiosConfig());
            this.setRefreshTokenInterceptor(this._axios);
        }
        return this._axios;
    }

    removeRefreshToken() {
        this._refreshToken = null;
        this.resetConfig();
        this._components.clientStorage.remove(
            this.refreshTokenKey,
            this._components.clientStorage.STORAGE_COOKIE,
        );
    }

    setRefreshToken(value) {
        this._refreshToken = value;
        this.resetConfig();
        this._components.clientStorage.set(
            this.refreshTokenKey,
            value,
            this._components.clientStorage.STORAGE_COOKIE,
            180,
        );
    }

    async getRefreshToken() {
        if (this._refreshToken === false) {
            this._refreshToken = await this._components.clientStorage.get(this.refreshTokenKey) || null;
        }
        return this._refreshToken;
    }

    onLogout() {
        this.removeAccessToken();
        this.removeRefreshToken();
    }
}