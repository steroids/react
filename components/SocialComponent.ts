import providers from './social';

/**
 * Social Component
 * Провайдер для социальных сетей. Обеспечивает вызов окна соц сети для oauth авторизации
 */
export default class SocialComponent {
    _components: any;
    _initializing: any;
    providers: any;

    constructor(components) {
        this.providers = {};
        this._initializing = {};
        this._components = components;
    }

    init() {
        Object.keys(this.providers).forEach(name => {
            if (providers[name]) {
                const config = this.providers[name] || {};
                this.providers[name] = new providers[name](this._components);
                Object.assign(this.providers[name], config);
            }
        });
        Object.keys(this.providers).forEach(name => {
            this._initializing[name] = this.providers[name].init();
        });
    }

    start(socialName) {
        if (!this._initializing[socialName]) {
            return Promise.reject();
        }
        return this._initializing[socialName].then(() =>
            this.providers[socialName].start()
        );
    }
}
