import React from 'react';
import fs from 'fs';
import path from 'path';
import IntlMessageFormat from 'intl-messageformat';
import {renderToString} from 'react-dom/server';
import _merge from 'lodash/merge';
import _set from 'lodash/set';

import SsrProvider from '../../ui/nav/Router/SsrProvider';
import utils from '../utils';

global.location = {};
global.IntlMessageFormat = IntlMessageFormat;
process.env.IS_SSR = true;
process.env.NODE_ENV = 'production';

const renderReact = async (Application, store, history, staticContext, accessToken, level = 0) => {
    const content = renderToString(
        <SsrProvider
            store={store}
            history={history}
            staticContext={staticContext}
        >
            <Application/>
        </SsrProvider>
    );

    const http = require('components').http;
    http.setAccessToken(accessToken);
    if (http._promises.length > 0 && level < 3) {
        try {
            await Promise.all(http._promises);
        } catch (e) {
            http._promises = [];
            throw e;
        }
        http._promises = [];

        // Wait redux update
        await new Promise(resolve => setTimeout(resolve));

        return renderReact(Application, store, history, staticContext, accessToken, level + 1);
    }

    return content;
};

const renderContent = async (defaultConfig, routes, assets, url, accessToken) => {
    const {walkRoutesRecursive} = require('../../ui/nav/navigationHoc');
    const StoreComponent = require('../../components/StoreComponent').default;
    const store = new StoreComponent();
    store.init({
        initialState: _merge(
            {},
            defaultConfig.ssr.initialState || {},
            {
                config: {
                    http: {
                        apiUrl: utils.getArgv('backendUrl') || process.env.APP_BACKEND_URL || '',
                    },
                },
                navigation: {
                    routesTree: walkRoutesRecursive(routes),
                },
            }
        ),
        history: {
            initialEntries: [
                url,
            ],
        },
    });
    const appPath = resolveFileExtension(path.join(defaultConfig.sourcePath, 'Application'));
    const Application = fs.existsSync(appPath) ? require(appPath).default : null;
    if (!Application) {
        return 'Not found Application component in ' + appPath;
    }

    // Render with graceful degradation on error
    const staticContext = {};
    let content = '';
    try {
        content = await renderReact(Application, store.store, store.history, staticContext, accessToken);
    } catch (e) {
        console.error('Render error in url ' + url, e);
    }

    // Get final redux state
    const state = _merge(
        store.getState(),
        {
            auth: {
                isInitialized: false,
            },
        }
    );
    _set(state, 'navigation.configs', []);

    // Get template path
    const templatePath = path.join(defaultConfig.sourcePath, 'index.html');
    let template = fs.existsSync(templatePath)
        ? fs.readFileSync(templatePath, 'utf8')
        : fs.readFileSync(__dirname + '/template.html', 'utf8');

    // Add css
    const cssFiles = assets.filter(asset => /\.css/.test(asset.name)).map(asset => `<link rel="stylesheet" href="/${asset.name}">`).join('\n');
    template = template.replace('</head>', '</head>' + cssFiles);

    // Add js
    const jsFiles = assets.filter(asset => /\.js/.test(asset.name)).map(asset => `<script src="/${asset.name}"></script>`).join('\n');
    const jsCode = 'window.APP_REDUX_PRELOAD_STATES = ' + JSON.stringify([state]);
    template = template.replace('</body>', `</body><script>${jsCode}</script>${jsFiles}`);

    // Add content
    template = template.replace('<div id="root">', '<div id="root">' + content);

    // Temp render for fill store
    return template;
};

const resolveFileExtension = path => {
    let result = null;
    ['js', 'ts', 'jsx', 'tsx', 'es6', 'es', 'mjs'].forEach(ext => {
        if (!result) {
            if (fs.existsSync(path + '.' + ext)) {
                result = path + '.' + ext;
            }
        }
    });
    return result;
};

export default async (url, accessToken, defaultConfig, getStats) => {
    // Skip for webpack dev server
    if (/^\/sockjs-node/.test(url) || /hot-update/.test(url)
        || /(jpe?g|gif|css|png|js|ico|xml|less|eot|svg|tff|woff2?|txt|map|mp4|ogg|webm|pdf|dmg|exe|html)$/.test(url)) {
        return false;
    }

    let content = '';

    // Find routes tree
    const routesPath = resolveFileExtension(path.join(defaultConfig.sourcePath, 'routes', 'index'));
    const routes = fs.existsSync(routesPath) ? require(routesPath) : null;
    if (routes) {
        const stats = getStats();
        if (stats) {
            const assets = stats.assets
                .filter(asset => asset.chunks.includes('index') || asset.chunks.includes('common'));

            try {
                content = await renderContent(defaultConfig, routes, assets, url, accessToken);
            } catch (e) {
                console.error('Render error in url ' + url, e);
            }
        }
    }

    return content;
};
