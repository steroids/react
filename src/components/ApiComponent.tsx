export interface IApiSendConfig {
    method?: HttpMethod,
    url?: string,
    params?: Record<string, unknown>,
}

export type IApiMethod = (api, params?: Record<string, unknown>, options?: Record<string, unknown>) => Promise<any>

export interface IApiRest {
    index?: IApiMethod,
    create?: IApiMethod,
    update?: IApiMethod,
    delete?: IApiMethod,
    view?: IApiMethod,
    [key: string]: IApiMethod,
}

/**
 * Http Component
 * Обертка над Axios для запросов на бекенд. Поддерживает токен авторизации, CSRF и обработку ошибок.
 */
export default class ApiComponent {
    _components: any;

    constructor(components) {
        this._components = components;
    }

    async send(config: IApiSendConfig) {
        const method = config.method || 'get';
        const params = {...config.params};
        const url = config.url.replace(/{([0-9a-z_]+)}/ig, (str, key: string) => {
            const value: any = params[key];
            delete params[key];
            return value;
        });

        return this._components.http.send(method, url, params);
    }
}
