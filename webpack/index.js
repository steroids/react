const webpack = require('webpack');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const express = require('express');
const WebpackDevServer = require('webpack-dev-server');

const api = require('./api');
const getConfigMain = require('./config.main');
const getConfigDefault = require('./config.default');
const getConfigDevServer = require('./config.devServer');

// Publish api
module.exports = api;

// Auto start after define config
setTimeout(() => Promise.all(api._entries)
    .then(result => {
        const webpackConfig = getConfigMain(
            api._config,
            Object.assign.apply(null, result)
        );
        const defaultConfig = _.merge(getConfigDefault(), api._config);

        // Init webpack compiler
        const compiler = webpack(webpackConfig);

        // Express app (for dev server and ssr)
        let expressApp = null;
        let getStats = null;
        let httpListen = null;
        let devServer = null;

        // Get env params
        if (fs.existsSync(path.resolve(defaultConfig.cwd, '.env'))) {
            require('dotenv').config({
                cwd: path.resolve(defaultConfig.cwd, '.env'),
            });
        }

        // Create output path
        const outputPath = (defaultConfig.ssr.statsPath || defaultConfig.outputPath);
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath);
        }

        // Stats save path
        const statsPath = outputPath + '/stats.json';

        if (api.isProduction()) {
            let _stats = null;
            getStats = () => _stats;

            if (!api.isSSR()) {
                // Production
                compiler.run(async (err, stats) => {
                    _stats = {
                        ...stats.toJson({all: false, assets: true}),
                        assetsUrls: Object.keys(stats.compilation.assets),
                    };

                    if (err) {
                        console.error(err);
                    } else {
                        fs.writeFileSync(statsPath, JSON.stringify(_stats, null, 2));

                        console.log(stats.toString({
                            chunks: false,
                            children: false,
                            colors: true,
                            publicPath: true,
                        }));
                    }

                    if (stats.compilation.errors && stats.compilation.errors.length > 0) {
                        process.exit(1);
                    }

                    if (api.isTestSSR()) {
                        console.log('Run SSR Test...');
                        require('./ssr/index').default('/', null, defaultConfig, getStats)
                            .catch(e => {
                                console.error('SSR test failed!', e);
                                process.exit(1);
                            });
                    }
                });
            } else if (fs.existsSync(statsPath)) {
                _stats = JSON.parse(fs.readFileSync(statsPath));
            }
        } else {
            const devServerConfig = getConfigDevServer(api._config);
            if (api.isSSR()) {
                devServerConfig.features = [
                    'setup',
                    'before',
                    'headers',
                    //'middleware', - Will be run after ssr
                    'proxy',
                    //'contentBaseFiles',
                    //'historyApiFallback',
                    //'contentBaseFiles',
                    //'contentBaseIndex',
                    'magicHtml',
                ];
            }

            // Development
            devServer = new WebpackDevServer(compiler, devServerConfig);
            expressApp = devServer.app;
            httpListen = devServer.listen.bind(devServer);
            getStats = () => ({
                ...devServer._stats.toJson({all: false, assets: true}),
                assetsUrls: Object.keys(devServer._stats.compilation.assets),
            });
        }

        if (api.isSSR() || api.isTestSSR()) {
            if (api.isSSR()) {
                console.log('SSR Enabled, source dir: ' + defaultConfig.sourcePath);

                // TODO Temporary disable ssl verification for https requests
                process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
            }

            require('@babel/register')(_.merge(
                {
                    extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react',
                        '@babel/typescript',
                    ],
                    plugins: [
                        ['@babel/plugin-proposal-decorators', {legacy: true}],
                        '@babel/plugin-proposal-class-properties',
                        '@babel/plugin-transform-runtime',
                        ['module-resolver', {
                            //root: webpackConfig.resolve.modules,
                            root: [defaultConfig.sourcePath],
                            alias: webpackConfig.resolve.alias,
                            "extensions": ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
                        }],
                        'require-context-hook',
                    ],
                    only: [
                        /lodash-es|steroidsjs/,
                        defaultConfig.sourcePath,
                    ],
                    cache: api.isProduction(),
                },
                defaultConfig.ssr.register || {}
            ));
            // Ignore .css and other includes
            ['css', 'less', 'scss', 'sass']
                .forEach(ext => require.extensions['.' + ext] = () => {});
            ['ttf', 'woff', 'woff2', 'png', 'jpg', 'jpeg', 'gif', !defaultConfig.inlineSvg ? 'svg' : null]
                .filter(Boolean)
                .forEach(ext => require.extensions['.' + ext] = (module, file) => {
                    const fileName = path.basename(file);
                    getStats().assetsUrls.find(publicUrl => {
                        let publicName = path.basename(publicUrl);
                        publicName = publicName.replace(new RegExp('\.?[a-z0-9]{32}\.' + ext), '.' + ext);

                        // TODO Логика соответствия по имени файла хрупкая и не всегда будет правильной. Но пока
                        // TODO не удалось достать полные пути исходного файла и публичного url
                        if (publicName === fileName) {
                            module.exports = '/' + _.trimStart(publicUrl, '/');
                            return true;
                        }
                        return false;
                    });
                    return module;
                });
            if (defaultConfig.inlineSvg) {
                require.extensions['.svg'] = function(module, filename) {
                    const svgStr = fs.readFileSync(filename, 'utf8');

                    // TODO Structure this code
                    // Code from https://github.com/webpack-contrib/svg-inline-loader/blob/master/index.js#L11
                    var regexSequences = [
                        // Remove XML stuffs and comments
                        [/<\?xml[\s\S]*?>/gi, ""],
                        [/<!doctype[\s\S]*?>/gi, ""],
                        [/<!--.*-->/gi, ""],
                        // SVG XML -> HTML5
                        [/\<([A-Za-z]+)([^\>]*)\/\>/g, "<$1$2></$1>"], // convert self-closing XML SVG nodes to explicitly closed HTML5 SVG nodes
                        [/\s+/g, " "],                                 // replace whitespace sequences with a single space
                        [/\> \</g, "><"]                               // remove whitespace between tags
                    ];
                    // Clean-up XML crusts like comments and doctype, etc.
                    module.exports = regexSequences.reduce(function (prev, regexSequence) {
                        return ''.replace.apply(prev, regexSequence);
                    }, svgStr).trim();

                    return module;
                };
            }
            require('./ssr/require-context')();

            if (api.isSSR()) {
                if (!expressApp) {
                    expressApp = express();
                    expressApp.use(express.static(defaultConfig.outputPath));
                    httpListen = expressApp.listen.bind(expressApp);
                }

                expressApp.get('*', async (request, response, next) => {
                    const accessTokenMatch = (request.headers.cookie || '').match(/accessToken\s*=\s*(\w+)/);
                    const accessToken = accessTokenMatch && accessTokenMatch[1] || null;

                    const content = await require('./ssr/index').default(request.url, accessToken, defaultConfig, getStats);
                    if (content === false) {
                        next();
                    } else {
                        response.writeHead(200, {'Content-Type': 'text/html'});
                        response.end(content);
                    }
                });

                // Use devServer middleware after ssr
                if (devServer) {
                    devServer.setupMiddleware();
                }
            }
        }

        if (expressApp && httpListen) {
            console.log(`Listening at http://${defaultConfig.host}:${defaultConfig.port}`);
            httpListen(defaultConfig.port, defaultConfig.host, (err) => {
                if (err) {
                    return console.error(err);
                }
            });
        }
    })
    .catch(e => console.error(e)));
