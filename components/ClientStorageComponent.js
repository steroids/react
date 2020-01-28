import cookie from 'js-cookie';

export default class ClientStorageComponent {

    constructor() {
        this.localStorageAvailable = !process.env.IS_SSR;
        this.sessionStorageAvailable = !process.env.IS_SSR;
        this.cookieAvailable = !process.env.IS_SSR;

        this.STORAGE_SESSION = 'session';
        this.STORAGE_LOCAL = 'local';
        this.STORAGE_COOKIE = 'cookie';

        if (this.localStorageAvailable) {
            try {
                window.localStorage.setItem('localStorageAvailable', true);
                window.localStorage.removeItem('localStorageAvailable');
            } catch (e) {
                this.localStorageAvailable = false;
            }
        }

        if (this.sessionStorageAvailable) {
            try {
                window.sessionStorage.setItem('sessionStorageAvailable', true);
                window.sessionStorage.removeItem('sessionStorageAvailable');
            } catch (e) {
                this.sessionStorageAvailable = false;
            }
        }
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
        } else if (this.sessionStorageAvailable && storageName === this.STORAGE_SESSION) {
            return window.sessionStorage.getItem(name);
        } else if (this.cookieAvailable) {
            return cookie.get(name);
        }
        return null;
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
        } else if (this.sessionStorageAvailable && storageName === this.STORAGE_SESSION) {
            window.sessionStorage.setItem(name, value);
        } else if (this.cookieAvailable) {
            cookie.set(name, value, {
                expires,
                domain: this._getDomain(),
            });
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
        } else if (this.sessionStorageAvailable && storageName === this.STORAGE_SESSION) {
            window.sessionStorage.removeItem(name);
        } else if (this.cookieAvailable) {
            cookie.remove(name, {
                domain: this._getDomain()
            });
        }
    }

    _getDomain() {
        const host = typeof location !== 'undefined' && location.hostname || '';
        return !/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(host) && host.split('.').slice(-2).join('.') || host;
    }

}
