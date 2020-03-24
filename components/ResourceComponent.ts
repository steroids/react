import * as queryString from 'query-string';
import _isArray from 'lodash-es/isArray';

export default class ResourceComponent {
    _callbacks: any;
    _components: any;
    googleApiKey: string;
    googleCaptchaSiteKey: string;
    language: string;
    static RESOURCE_GOOGLE_MAP_API = '//maps.googleapis.com/maps/api/js';
    static RESOURCE_YANDEX_MAP_API = 'https://api-maps.yandex.ru/2.1/';
    static RESOURCE_TWITTER_WIDGET = 'https://platform.twitter.com/widgets.js';
    static RESOURCE_GEETEST_API = '//static.geetest.com/static/tools/gt.js';

    constructor(components, config) {
        this.googleApiKey = config.googleApiKey || '';
        this.googleCaptchaSiteKey = config.googleCaptchaSiteKey || '';
        this.language = config.language || '';
        this._callbacks = {};
        this._components = components;
    }

    loadGoogleMapApi() {
        const locale = this._components.locale;
        // @ts-ignore
        if (window.google && window.google.maps) {
            // @ts-ignore
            return Promise.resolve(window.google.maps);
        }
        return this.loadScript(
            ResourceComponent.RESOURCE_GOOGLE_MAP_API,
            {
                libraries: 'places',
                key: this.googleApiKey,
                language: this.language || locale.language,
            },
            // @ts-ignore
            () => window.google.maps
        );
    }

    loadYandexMap() {
        const locale = this._components.locale;
        // @ts-ignore
        if (window.ymaps) {
            return new Promise(resolve =>
                // @ts-ignore
                window.ymaps.ready(() => resolve(window.ymaps))
            );
        }
        return this.loadScript(
            ResourceComponent.RESOURCE_YANDEX_MAP_API,
            {
                lang: this.language || locale.language
            },
            // @ts-ignore
            () => new Promise(resolve => window.ymaps.ready(() => resolve(window.ymaps)))
        );
    }

    loadTwitterWidget() {
        // @ts-ignore
        if (window.twttr) {
            // @ts-ignore
            return Promise.resolve(window.twttr);
        }
        return this.loadScript(
            ResourceComponent.RESOURCE_TWITTER_WIDGET,
            {},
            // @ts-ignore
            () => new Promise(resolve => window.twttr.ready(() => resolve(window.twttr)))
        );
    }

    loadGeetest() {
        // @ts-ignore
        if (window.initGeetest) {
            // @ts-ignore
            return Promise.resolve(window.initGeetest);
        }
        return this.loadScript(
            ResourceComponent.RESOURCE_GEETEST_API + '?_t=' + new Date().getTime(),
            {},
            // @ts-ignore
            () => window.initGeetest
        );
    }

    loadScript(url, params, firstResolver) {
        if (this._callbacks[url] === true) {
            return Promise.resolve(firstResolver());
        }
        if (_isArray(this._callbacks[url])) {
            return new Promise(resolve => {
                this._callbacks[url].push(resolve);
            });
        }
        this._callbacks[url] = [];
        // Append script to page
        return new Promise((resolve, reject) => {
            let script = document.createElement('script');
            script.async = true;
            script.onload = () => {
                setTimeout(() => {
                    Promise.resolve(firstResolver())
                        .then(result => {
                            // Resolve current
                            resolve(result);
                            // Resolve queue promises after current
                            const callbacks = this._callbacks[url];
                            this._callbacks[url] = true;
                            callbacks.forEach(callback => callback(result));
                        })
                        .catch(reject);
                });
            };
            script.src = url + (params ? '?' + queryString.stringify(params) : '');
            document.body.appendChild(script);
        });
    }

    wait(condition, timeout = 5000) {
        const start = Date.now();
        const checker = (resolve, reject) => {
            const result = condition();
            if (result) {
                resolve(result);
            } else if (start + timeout > Date.now()) {
                reject();
            } else {
                setTimeout(() => checker(resolve, reject), 500);
            }
        };
        return new Promise(checker);
    }
}
