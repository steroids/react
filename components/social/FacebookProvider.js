export default class FacebookProvider {

    constructor(components) {
        this._components = components;

        this.clientId = '';
        this.language = this._components.locale.language + '_' + this._components.locale.language.toUpperCase();
    }

    async init() {
        window.fbAsyncInit = () => {
            window.FB.init({
                version: 'v3.1',
                appId: this.clientId,
                xfbml: false,
                cookie: false,
            });
        };

        return this._components.resource.loadScript(
            `https://connect.facebook.net/${this.language}/sdk.js`,
            null,
            () => this._components.resource.wait(() => window.FB)
        );
    }

    async start() {
        return new Promise((resolve, reject) => {
            window.FB.login(
                response => {
                    if (response.authResponse) {
                        resolve({
                            token: response.authResponse.accessToken,
                        });
                    } else {
                        reject('FB error: ' + response.status);
                    }
                },
                {
                    scope: 'public_profile,email',
                    return_scopes: false,
                    auth_type: ''
                }
            );
        });
    }

}

