/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as queryString from 'qs';
import _isArray from 'lodash-es/isArray';

declare global {
    interface Window {
        grecaptcha: {
            ready: (...args: any[]) => void,
            execute: (...args: any[]) => Promise<string>
        };
    }
}

export interface IResourceComponentConfig {
    /**
     * API-ключ Google для использования Google Maps и других сервисов.
     */
    googleApiKey?: string;

    /**
     * Языковой код, используемый для загрузки ресурсов.
     */
    language?: string;
}

export interface IResourceComponent extends IResourceComponentConfig {
    /**
     * Ключ сайта Google reCAPTCHA.
     */
    googleCaptchaSiteKey: string;

    /**
     * URL для загрузки Google Maps API.
     */
    readonly RESOURCE_GOOGLE_MAP_API: string;

    /**
     * URL для загрузки Yandex Maps API.
     */
    readonly RESOURCE_YANDEX_MAP_API: string;

    /**
     * URL для загрузки Twitter виджетов.
     */
    readonly RESOURCE_TWITTER_WIDGET: string;

    /**
     * URL для загрузки Geetest.
     */
    readonly RESOURCE_GEETEST_API: string;

    /**
     * URL для загрузки Google reCAPTCHA.
     */
    readonly RESOURCE_GOOGLE_CAPTCHA: string;

    /**
     * Метод для загрузки Google reCAPTCHA.
     * @returns Промис, который разрешается с объектом window.grecaptcha.
     */
    loadGoogleCaptcha(): Promise<any>;

    /**
     * Метод для загрузки Google Maps API.
     * @returns Промис, который разрешается с объектом window.google.maps.
     */
    loadGoogleMapApi(): Promise<any>;

    /**
     * Метод для загрузки Yandex Maps API.
     * @returns Промис, который разрешается с объектом window.ymaps.
     */
    loadYandexMap(): Promise<any>;

    /**
     * Метод для загрузки Twitter виджетов.
     * @returns Промис, который разрешается с объектом window.twttr.
     */
    loadTwitterWidget(): Promise<any>;

    /**
     * Метод для загрузки Geetest.
     * @returns Промис, который разрешается с объектом window.initGeetest.
     */
    loadGeetest(): Promise<any>;

    /**
     * Метод для загрузки скрипта по указанному URL.
     * @param url URL скрипта для загрузки.
     * @param params Параметры запроса для URL скрипта.
     * @param firstResolver Функция, которая возвращает объект, разрешающий промис.
     * @returns Промис, который разрешается с результатом первого разрешенного промиса.
     */
    loadScript(url: string, params: any, firstResolver: () => any): Promise<any>;

    /**
     * Метод для ожидания выполнения определенного условия.
     * @param condition Условие, которое должно быть выполнено.
     * @param timeout (Необязательный) Таймаут ожидания в миллисекундах (по умолчанию 5000 мс).
     * @returns Промис, который разрешается с результатом выполнения условия.
     */
    wait(condition: () => boolean, timeout?: number): Promise<any>;
}

/**
 * Resource Component
 * Компонент для подгрузки внешних API: Google Maps, Yandex Maps, Twitter, ...
 */
export default class ResourceComponent implements IResourceComponent {
    protected _callbacks: any;

    protected _components: any;

    googleApiKey?: string;

    googleCaptchaSiteKey: string;

    language?: string;

    readonly RESOURCE_GOOGLE_MAP_API = '//maps.googleapis.com/maps/api/js';

    readonly RESOURCE_YANDEX_MAP_API = 'https://api-maps.yandex.ru/2.1/';

    readonly RESOURCE_TWITTER_WIDGET = 'https://platform.twitter.com/widgets.js';

    readonly RESOURCE_GEETEST_API = '//static.geetest.com/static/tools/gt.js';

    readonly RESOURCE_GOOGLE_CAPTCHA = 'https://www.google.com/recaptcha/api.js';

    constructor(components, config) {
        this.googleApiKey = config.googleApiKey || '';
        this.googleCaptchaSiteKey = process.env.APP_RECAPTCHA_SITE_KEY || '';
        this.language = config.language || '';
        this._callbacks = {};
        this._components = components;
    }

    loadGoogleCaptcha() {
        if (window.grecaptcha) {
            return Promise.resolve(window.grecaptcha);
        }

        return this.loadScript(
            this.RESOURCE_GOOGLE_CAPTCHA,
            {render: this.googleCaptchaSiteKey},
            () => window.grecaptcha,
        );
    }

    loadGoogleMapApi() {
        const locale = this._components.locale;
        // @ts-ignore
        if (window.google && window.google.maps) {
            // @ts-ignore
            return Promise.resolve(window.google.maps);
        }
        return this.loadScript(
            this.RESOURCE_GOOGLE_MAP_API,
            {
                libraries: 'places,geometry',
                key: this.googleApiKey,
                language: this.language || locale.language,
            },
            // @ts-ignore
            () => window.google.maps,
        );
    }

    loadYandexMap() {
        const locale = this._components.locale;
        // @ts-ignore
        if (window.ymaps) {
            return new Promise(resolve =>
                // @ts-ignore
                // eslint-disable-next-line implicit-arrow-linebreak
                window.ymaps.ready(() => resolve(window.ymaps)));
        }
        return this.loadScript(
            this.RESOURCE_YANDEX_MAP_API,
            {
                lang: this.language || locale.language,
            },
            // @ts-ignore
            () => new Promise(resolve => window.ymaps.ready(() => resolve(window.ymaps))),
        );
    }

    loadTwitterWidget() {
        // @ts-ignore
        if (window.twttr) {
            // @ts-ignore
            return Promise.resolve(window.twttr);
        }
        return this.loadScript(
            this.RESOURCE_TWITTER_WIDGET,
            {},
            // @ts-ignore
            () => new Promise(resolve => window.twttr.ready(() => resolve(window.twttr))),
        );
    }

    loadGeetest() {
        // @ts-ignore
        if (window.initGeetest) {
            // @ts-ignore
            return Promise.resolve(window.initGeetest);
        }
        return this.loadScript(
            this.RESOURCE_GEETEST_API + '?_t=' + new Date().getTime(),
            {},
            // @ts-ignore
            () => window.initGeetest,
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
            const script = document.createElement('script');
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
