import _upperFirst from 'lodash-es/upperFirst';
import _isEmpty from 'lodash-es/isEmpty';
import {isInitialized} from '../reducers/auth';

declare global {
    interface Window {
        ym: any;
        dataLayer: any;
        VK: any;
        fbq: any;
        _fbq: any;
    }
}

type ConfigType = {
    counters?: {
        yandexMetrika?: any,
        googleTagManager?: any,
        googleAnalytics?: any,
        vkRetargeting?: any,
        facebookAnalytics?: any,
    },
    enable?: boolean
}

export interface IMetricsComponent {
    /**
     * Отписаться от метрик
     */
    unsubscribe: VoidFunction;

    /**
     * Отменить прослушивание метрик
     */
    unlisten: VoidFunction;

    /**
     * Поменять счетчики
     * @param values Значения
     */
    setCounters(values: any): void;
}

/**
 * Metrics Component
 * Компонент для добавления метрик в приложение (например яндекс метрики)
 */
export default class MetricsComponent implements IMetricsComponent {
    _components: any;

    _prevUrl: string;

    _isMetricsInitialized: boolean;

    _config: any;

    _enable: boolean;

    _yandexMetrika: any;

    unsubscribe: () => void;

    unlisten: () => void;

    constructor(components, config: ConfigType = {}) {
        this._components = components;
        this._isMetricsInitialized = false;
        this._config = config;
        this._enable = config.enable === undefined
            ? process.env.APP_ENV === 'prod'
            : !!config.enable;

        if (!process.env.IS_SSR) {
            this._init();
        }
    }

    _init() {
        this.unsubscribe = this._components.store.subscribe(() => {
            const {store} = this._components;
            const state = store.getState();

            if (!isInitialized(state)) {
                return;
            }

            this.unsubscribe();
            this.setCounters(this._config.counters);

            if (this._enable && this._yandexMetrika) {
                this.unlisten = store.history.listen(({pathname, search, hash}) => {
                    this._changePageViewHandler(pathname + search + hash);
                });
            }
        });
    }

    setCounters(values) {
        if (!this._enable || _isEmpty(values) || this._isMetricsInitialized) {
            return;
        }

        Object.entries(values).forEach(([counterName, counterValue]) => {
            if (counterValue) {
                this._isMetricsInitialized = true;
                this['_' + counterName] = counterValue;
                const setter = '_set' + _upperFirst(counterName);
                this[setter](counterValue);
            }
        });
    }

    _setYandexMetrika(value) {
        (function (m, e, t, r, i, k, a) {
            m[i] = m[i] || function (...args) {
                (m[i].a = m[i].a || []).push(args);
            };
            m[i].l = Date.now();
            k = e.createElement(t);
            a = e.getElementsByTagName(t)[0];
            k.async = 1;
            k.src = r;
            a.parentNode.insertBefore(k, a);
        }(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym'));

        window.ym(value, 'init', {
            defer: true,
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
        });
    }

    _setGoogleTagManager(value) {
        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(), event: 'gtm.js',
            });
            const f = d.getElementsByTagName(s)[0];
            const j = d.createElement(s) as HTMLScriptElement;
            const dl = l !== 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        }(window, document, 'script', 'dataLayer', value));
    }

    _setGoogleAnalytics(value) {
        const googleLoad = document.createElement('script');
        googleLoad.async = true;
        googleLoad.src = `https://www.googletagmanager.com/gtag/js?id=${value}`;
        document.body.appendChild(googleLoad);

        window.dataLayer = window.dataLayer || [];

        function gtag(...args: any[]): any;
        function gtag(...args) {
            window.dataLayer.push(args);
        }

        gtag('js', new Date());
        gtag('config', value);
    }

    _setVkRetargeting(value) {
        const t = document.createElement('script');
        t.type = 'text/javascript';
        t.async = !0;
        t.src = 'https://vk.com/js/api/openapi.js?168';
        t.onload = function () {
            window.VK.Retargeting.Init(value);
            window.VK.Retargeting.Hit();
        };
        document.head.appendChild(t);
    }

    _setFacebookAnalytics(value) {
        (function (f, b, e, v, n, t, s) {
            if (f.fbq) { return; }
            n = function (...args) {
                // eslint-disable-next-line no-unused-expressions
                n.callMethod ? n.callMethod(...args) : n.queue.push(args);
            };
            f.fbq = n;
            if (!f._fbq) { f._fbq = n; }
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js'));

        window.fbq('init', value);
        window.fbq('track', 'PageView');
    }

    _changePageViewHandler(url) {
        if (this._prevUrl !== url) {
            window.ym(this._yandexMetrika, 'hit', url);
            this._prevUrl = url;
        }
    }
}
