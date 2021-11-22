import * as queryString from 'qs';

export default class Vk {
    _components: any;

    clientId: string;

    constructor(components, config) {
        this._components = components;
        this.clientId = config.clientId;
    }

    async init() {
        return Promise.resolve();
    }

    async start() {
        return new Promise((resolve, reject) => {
            // Generate url
            const url = 'https://steamcommunity.com/openid/login?'
                + queryString.stringify({
                    'openid.mode': 'checkid_setup',
                    'openid.ns': 'http://specs.openid.net/auth/2.0',
                    'openid.identity':
                        'http://specs.openid.net/auth/2.0/identifier_select',
                    'openid.claimed_id':
                        'http://specs.openid.net/auth/2.0/identifier_select',
                    'openid.return_to': this._components.http.getUrl(
                        '/api/v1/auth/social/proxy',
                    ),
                    'openid.realm': window.location.origin,
                });
            // Open popup auth window
            const width = 900;
            const height = 600;
            const params = {
                toolbar: 'no',
                location: 'no',
                directories: 'no',
                status: 'no',
                menubar: 'no',
                scrollbars: 'no',
                resizable: 'no',
                width,
                height,
                left: window.screen.width / 2 - width / 2,
                top: window.screen.height / 2 - height / 2,
            };
            const popup = window.open(
                url,
                __('Авторизация через Steam'),
                Object.entries(params)
                    .map(([key, value]) => key + '=' + value)
                    .join(','),
            );
            popup.onbeforeunload = () => reject();

            // This is a handler which is used by child window to pass auth result
            (window as any).authCallback = link => {
                const query = queryString.parse(new URL(link).search);
                if (!query['openid.mode']) {
                    reject();
                } else {
                    resolve(query);
                }
            };
        });
    }
}
