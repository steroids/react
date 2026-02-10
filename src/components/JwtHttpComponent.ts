import {logout} from '@steroidsjs/core/actions/auth';
import BaseHttpComponent from '@steroidsjs/core/components/HttpComponent';
import axios from 'axios';

export interface IRefreshTokenRequest {
    url: string,
    method: string,
}

export interface IJwtHttpComponentConfig {
    /**
     * Запрос на обновление токена авторизации
     */
    refreshTokenRequest?: IRefreshTokenRequest,

    /**
     * Ключ токена авторизации для локального хранилища
     */
    refreshTokenKey?: string,
}

/**
 * JwtHttpComponent
 * Вариация HttpComponent с функционалом обновления токена авторизации
 */
export default class JwtHttpComponent extends BaseHttpComponent implements IJwtHttpComponentConfig {
    refreshTokenRequest?: IRefreshTokenRequest;

    refreshTokenKey? = 'refreshToken';

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
            const tokenValue = clientStorage.get(this.refreshTokenKey, this.clientStorageName)
                || clientStorage.get(this.refreshTokenKey)
                || null;

            this._refreshToken = tokenValue instanceof Promise
                ? await tokenValue
                : tokenValue;

            if (this._refreshToken) {
                clientStorage.set(
                    this.refreshTokenKey,
                    this._refreshToken,
                    this.clientStorageName,
                    this.clientStorageExpiresIn,
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
                if (
                    error.response.status === 401
                    && error.config
                    && !error.config._isRetry
                    && originalRequest.url !== this.getUrl(this.refreshTokenRequest?.url)
                ) {
                    this.removeAccessToken();
                    const {store} = this._components;

                    try {
                        const response = await this.send(
                            this.refreshTokenRequest.method,
                            this.refreshTokenRequest.url,
                            {
                                [this.refreshTokenKey]: this._refreshToken,
                            },
                        );
                        const accessToken = response?.data?.[this.accessTokenKey];
                        if (accessToken) {
                            this.setAccessToken(accessToken);
                            originalRequest._isRetry = true;
                            originalRequest.headers.Authorization = 'Bearer ' + accessToken;
                            return axiosInstance.request(originalRequest);
                        }
                    } catch {
                        store.dispatch(logout());
                    }
                    store.dispatch(logout());
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
            this.clientStorageName,
        );
    }

    setRefreshToken(value) {
        this._refreshToken = value;
        this.resetConfig();
        this._components.clientStorage.set(
            this.refreshTokenKey,
            value,
            this.clientStorageName,
            this.clientStorageExpiresIn,
        );
    }

    async getRefreshToken() {
        if (this._refreshToken === false) {
            this._refreshToken = await this._components.clientStorage.get(
                this.refreshTokenKey,
                this.clientStorageName,
            ) || null;
        }
        return this._refreshToken;
    }

    onLogout() {
        this.removeAccessToken();
        this.removeRefreshToken();
    }

    onLogin(params: {
        accessToken: string,
        refreshToken: string,
    }) {
        this.setAccessToken(params.accessToken);
        this.setRefreshToken(params.refreshToken);
    }
}
