export default class GoogleProvider {
    _components: any;

    clientId: string;

    constructor(components, config) {
        this._components = components;
        this.clientId = config.clientId;
    }

    async init() {
        return this._components.resource.loadScript(
            'https://apis.google.com/js/client:platform.js',
            null,
            async () => {
                const gapi = await this._components.resource.wait(() => (window as any).gapi);
                return new Promise(resolve => {
                    gapi.load('auth2', () => {
                        if (gapi.auth2.getAuthInstance()) {
                            return;
                        }
                        gapi.auth2
                            .init({
                                client_id: this.clientId,
                                cookie_policy: 'single_host_origin',
                                //login_hint: loginHint,
                                //hosted_domain: hostedDomain,
                                fetch_basic_profile: true,
                                ux_mode: 'popup',
                                scope: 'profile email',
                                access_type: 'online',
                            })
                            .then(resolve);
                    });
                });
            },
        );
    }

    async start() {
        const response = await (window as any).gapi.auth2.getAuthInstance().signIn();
        return {
            token: response.getAuthResponse().id_token,
        };
    }
}
