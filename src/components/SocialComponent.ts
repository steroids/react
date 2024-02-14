import _isFunction from 'lodash-es/isFunction';

export interface ISocialComponent {
    /**
     * Провайдеры
     */
    providers: any,

    /**
     * Старт
     * @param socialName Название social.
     */
    start(socialName: string): void,

    /**
     * Инициализация компонента
     */
    init(): void,
}

/**
 * Social Component
 * Провайдер для социальных сетей. Обеспечивает вызов окна соц сети для oauth авторизации
 */
export default class SocialComponent implements ISocialComponent {
    _components: any;

    _initializing: any;

    providers: any;

    constructor(components, config) {
        this.providers = config.providers || {};
        this._initializing = {};
        this._components = components;
    }

    init() {
        Object.keys(this.providers).forEach(name => {
            if (_isFunction(this.providers[name])) {
                this.providers[name] = {className: this.providers[name]};
            }

            const ProviderClass = this.providers[name].className;
            delete this.providers[name].className;
            if (!ProviderClass) {
                throw new Error('Not found class for social provider: ' + name);
            }

            this.providers[name] = new ProviderClass(this._components, this.providers[name]);
        });
        Object.keys(this.providers).forEach(name => {
            this._initializing[name] = this.providers[name].init();
        });
    }

    start(socialName) {
        if (!this._initializing[socialName]) {
            return Promise.reject();
        }
        return this._initializing[socialName].then(() => this.providers[socialName].start());
    }
}
