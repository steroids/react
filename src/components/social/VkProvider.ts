import * as queryString from 'qs';

export default class VkProvider {
    _components: any;

    clientId: string;

    redirectUrl: any;

    constructor(components, config) {
        this._components = components;
        this.clientId = config.clientId;
        this.redirectUrl = config.redirectUrl || this._components.http.getUrl('/api/v1/auth/social/proxy');
    }

    async init() {
        return Promise.resolve();
    }

    async start() {
        return new Promise((resolve, reject) => {
            // Generate url
            const url = 'https://oauth.vk.com/authorize/?'
                + queryString.stringify({
                    client_id: this.clientId,
                    redirect_uri: this.redirectUrl,
                    scope: 'offline,public_profile',
                    response_type: 'code',
                });
            // Open popup auth window
            const width = 655;
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
                __('Авторизация через VK'),
                Object.entries(params)
                    .map(([key, value]) => key + '=' + value)
                    .join(','),
            );
            popup.onbeforeunload = () => reject();

            // This is a handler which is used by child window to pass auth result
            (window as any).authCallback = link => {
                const query = new URL(link).searchParams;
                const error = query.get('error');
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        token: query.get('code'),
                    });
                }
            };
        });
    }
}
