const utils = require('./utils');
const path = require('path');

module.exports = () => {
    return {
        cwd: process.cwd(),
        host: '127.0.0.1',
        port: utils.generatePort(),
        outputPath: path.resolve(process.cwd(), 'public'),
        staticPath: !utils.isProduction() ? 'static/1.0/' : '',
        sourcePath: path.resolve(process.cwd(), 'app/core/frontend'),
        baseUrl: 'assets/',
        useHash: false,
        inlineSvg: false,
        ssr: {}, // you custom ssr config
        webpack: {}, // you custom webpack config
        devServer: {}, // you custom dev server config
    };
};
