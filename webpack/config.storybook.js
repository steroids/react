const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const utils = require('./utils');
const getConfigDefault = require('./config.default');
const mergeConfigs = require('@storybook/core/dist/server/utils/merge-webpack-config').default;

module.exports = (config) => {
    config = _.merge(getConfigDefault(), config);

    // Init default webpack config
    let webpackConfig = {
        module: {
            rules: {
                less: {
                    test: /\.less$/,
                    use: {
                        style: {
                            loader: 'style-loader',
                        },
                        css: {
                            loader: 'css-loader',
                        },
                        less: {
                            loader: 'less-loader',
                        },
                    },
                },
                sass: {
                    test: /\.scss$/,
                    use: {
                        style: {
                            loader: 'style-loader',
                        },
                        css: {
                            loader: 'css-loader',
                        },
                        sass: {
                            loader: 'sass-loader',
                        },
                    }
                },
                font: {
                    test: /(\/|\\)fonts(\/|\\).*\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                    use: {
                        file: {
                            loader: 'file-loader',
                            options: {
                                name: 'fonts/[name].[ext]'
                            },
                        },
                    },
                },
                image: {
                    test: /\.(jpe?g|gif|png|svg)$/,
                    use: {
                        file: {
                            loader: 'file-loader'
                        },
                    },
                },
            },
        },
    };

    // Merge with custom
    webpackConfig = _.merge(
        webpackConfig,
        config.webpack
    );

    // Normalize rules (objects -> arrays)
    webpackConfig.module.rules = Object.keys(webpackConfig.module.rules)
        .map(key => {
            const item = webpackConfig.module.rules[key];
            if (item.use) {
                item.use = _.values(item.use).filter(Boolean);
            }

            return item;
        })
        .filter(Boolean);

    return storybookConfig => {
        const finalConfig = mergeConfigs(storybookConfig.config, webpackConfig);

        // No exclude steroids package - it's es6 code
        finalConfig.module.rules[0].exclude = /node_modules(\/|\\+)(?!@steroidsjs)/;

        // Add decorators
        finalConfig.module.rules[0].use[0].options.plugins.unshift(['@babel/plugin-proposal-decorators', {legacy: true}]);

        return finalConfig;
    };
};
