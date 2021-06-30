import * as cookie from 'js-cookie';

/**
 * Client Storage Component
 * Слой хранения данных в браузере (cookie, local/session storage) или ReactNative
 */
export default class ClientStorageComponent {
    STORAGE_COOKIE: string;
    STORAGE_LOCAL: any;
    STORAGE_SESSION: any;
    localStorageAvailable: boolean;
    sessionStorageAvailable: boolean;
    private _ssrCookie: Record<string, any>

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
                this.sessionStorageAvailable = window.localStorage.getItem('sessionStorageAvailable') === '1';
                window.sessionStorage.removeItem('sessionStorageAvailable');
            } catch (e) {
                this.sessionStorageAvailable = false;
            }
        }

        this._ssrCookie = config?.ssrCookie;
    }

    /**
     * @param {string} name
     * @param {string} [storageName]
     * @returns {*}
     */
    get(name, storageName) {
        storageName = storageName || this.STORAGE_LOCAL;
        if (this.localStorageAvailable && storageName === this.STORAGE_LOCAL) {
            return window.localStorage.getItem(name);
        } else if (
            this.sessionStorageAvailable &&
            storageName === this.STORAGE_SESSION
        ) {
            return window.sessionStorage.getItem(name);
        } else {
            return process.env.IS_SSR ? this._ssrCookie.get(name) : cookie.get(name);
        }
    }

    /**
     * @param {string} name
     * @param {*} value
     * @param {string} [storageName]
     * @param {number|null} [expires]
     */
    set(name, value, storageName, expires = null) {
        storageName = storageName || this.STORAGE_LOCAL;
        if (this.localStorageAvailable && storageName === this.STORAGE_LOCAL) {
            window.localStorage.setItem(name, value);
        } else if (
            this.sessionStorageAvailable &&
            storageName === this.STORAGE_SESSION
        ) {
            window.sessionStorage.setItem(name, value);
        } else {
            const options = {
                expires,
                domain: this._getDomain()
            };
            process.env.IS_SSR ? this._ssrCookie.set(name, value, options) : cookie.set(name, value, options);
        }
    }

    /**
     *
     * @param {string} name
     * @param {string} [storageName]
     */
    remove(name, storageName) {
        storageName = storageName || this.STORAGE_LOCAL;
        if (this.localStorageAvailable && storageName === this.STORAGE_LOCAL) {
            window.localStorage.removeItem(name);
        } else if (
            this.sessionStorageAvailable &&
            storageName === this.STORAGE_SESSION
        ) {
            window.sessionStorage.removeItem(name);
        } else {
            const options = {
                domain: this._getDomain()
            };
            process.env.IS_SSR ? this._ssrCookie.remove(name, options) : cookie.remove(name, options);
        }
    }

    _getDomain() {
        const host = (typeof location !== 'undefined' && location.hostname) || '';
        return (
            (!/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(host) &&
                host
                    .split('.')
                    .slice(-2)
                    .join('.')) ||
            host
        );
    }
}
