export default class GitlabProvider {
    _components: any;
    url: string;
    redirectUrl: any;

    constructor(components) {
        this._components = components;
        this.url = '';
        this.redirectUrl = this._components.http.getUrl('/api/v1/auth/social/proxy');
    }

    async init() {
        return Promise.resolve();
    }

    async start() {
        return new Promise((resolve, reject) => {
            // Open popup auth window
            const width = 600;
            const height = 400;
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
                top: window.screen.height / 2 - height / 2
            };
            const popup = window.open(
                this.url,
                __('Авторизация через Gitlab'),
                Object.entries(params)
                    .map(([key, value]) => key + '=' + value)
                    .join(',')
            );
            popup.onbeforeunload = () => reject();

            // This is a handler which is used by child window to pass auth result
            // @ts-ignore
            window.authCallback = link => {
                // link: http://127.0.0.1:9424/api/v1/auth/social/proxy?provider=gitlab_kozhindev#access_token=7b87e3de0000000111111122222223333333d1b4ff3ee3f040085518198d885d&token_type=Bearer
                const token = (/access_token=(\w+)/.exec(link) || [])[1];
                if (token) {
                    resolve({token});
                } else {
                    reject();
                }
            };
        });
    }
}
