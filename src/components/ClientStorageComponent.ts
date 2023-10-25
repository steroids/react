/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import * as cookie from 'js-cookie';
import dayjs from 'dayjs';

export interface IClientStorageComponentConfig {
    /**
     * Кастомный домен
     */
    domain?: string,

    /**
     * Куки для режима ssr
     */
    ssrCookie?: any,
}

/**
 * Интерфейс для ClientStorageComponent
 */
export interface IClientStorageComponent extends IClientStorageComponentConfig {
    /**
     * Получить значение из хранилища.
     * @param name Имя записи.
     * @param storageName (Необязательный) Имя хранилища (local, session, или cookie).
     * @returns Значение записи.
     */
    get(name: string, storageName?: 'local' | 'session' | 'cookie'): string | null;

    /**
     * Установить значение в хранилище.
     * @param name Имя записи.
     * @param value Значение записи.
     * @param storageName (Необязательный) Имя хранилища (local, session, или cookie).
     * @param expires (Необязательный) Срок действия записи в днях.
     */
    set(name: string, value: string, storageName?: 'local' | 'session' | 'cookie', expires?: number | null): void;

    /**
     * Удалить значение из хранилища.
     * @param name Имя записи.
     * @param storageName (Необязательный) Имя хранилища (local, session, или cookie).
     */
    remove(name: string, storageName?: 'local' | 'session' | 'cookie'): void;
}

/**
 * Client Storage Component
 * Слой хранения данных в браузере (cookie, local/session storage) или ReactNative
 */
export default class ClientStorageComponent implements IClientStorageComponent {
    STORAGE_COOKIE: string;

    STORAGE_LOCAL: any;

    STORAGE_SESSION: any;

    localStorageAvailable: boolean;

    sessionStorageAvailable: boolean;

    domain?: string;

    private _ssrCookie: Record<string, any>;

    constructor(components, config) {
        this.localStorageAvailable = !process.env.IS_SSR;
        this.sessionStorageAvailable = !process.env.IS_SSR;
        this.STORAGE_SESSION = 'session';
        this.STORAGE_LOCAL = 'local';
        this.STORAGE_COOKIE = 'cookie';
        if (this.localStorageAvailable) {
            try {
                window.localStorage.setItem('localStorageAvailable', '1');
                this.localStorageAvailable = window.localStorage.getItem('localStorageAvailable') === '1';
                window.localStorage.removeItem('localStorageAvailable');
            } catch (e) {
                this.localStorageAvailable = false;
            }
        }
        if (this.sessionStorageAvailable) {
            try {
                window.sessionStorage.setItem('sessionStorageAvailable', '1');
                this.sessionStorageAvailable = window.sessionStorage.getItem('sessionStorageAvailable') === '1';
                window.sessionStorage.removeItem('sessionStorageAvailable');
            } catch (e) {
                this.sessionStorageAvailable = false;
            }
        }

        this.domain = config?.domain || null;
        this._ssrCookie = config?.ssrCookie;
    }

    get(name, storageName) {
        storageName = storageName || this.STORAGE_LOCAL;
        if (this.localStorageAvailable && storageName === this.STORAGE_LOCAL) {
            return window.localStorage.getItem(name);
        } if (
            this.sessionStorageAvailable
            && storageName === this.STORAGE_SESSION
        ) {
            return window.sessionStorage.getItem(name);
        }
        return process.env.IS_SSR ? this._ssrCookie.get(name) : cookie.get(name);
    }

    set(name, value, storageName, expires = null) {
        storageName = storageName || this.STORAGE_LOCAL;
        if (this.localStorageAvailable && storageName === this.STORAGE_LOCAL) {
            window.localStorage.setItem(name, value);
        } else if (
            this.sessionStorageAvailable
            && storageName === this.STORAGE_SESSION
        ) {
            window.sessionStorage.setItem(name, value);
        } else {
            const options = {
                expires,
                domain: this._getDomain(),
            };

            if (expires && process.env.IS_SSR) {
                options.expires = dayjs().add(options.expires, 'days').utc().toDate();
            }

            process.env.IS_SSR ? this._ssrCookie.set(name, value, options) : cookie.set(name, value, options);
        }
    }

    remove(name, storageName) {
        storageName = storageName || this.STORAGE_LOCAL;
        if (this.localStorageAvailable && storageName === this.STORAGE_LOCAL) {
            window.localStorage.removeItem(name);
        } else if (
            this.sessionStorageAvailable
            && storageName === this.STORAGE_SESSION
        ) {
            window.sessionStorage.removeItem(name);
        } else {
            const options = {
                domain: this._getDomain(),
            };
            process.env.IS_SSR ? this._ssrCookie.remove(name, options) : cookie.remove(name, options);
        }
    }

    _getDomain() {
        if (this.domain) {
            return this.domain;
        }

        const host = (typeof window.location !== 'undefined' && window.location.hostname) || '';
        return (
            (!/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(host)
                && host
                    .split('.')
                    .slice(-2)
                    .join('.'))
            || host
        );
    }
}
