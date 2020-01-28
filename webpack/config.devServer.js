const _ = require('lodash');
const getConfigDefault = require('./config.default');

module.exports = (config) => {
    config = _.merge(getConfigDefault(), config);

    let devServerConfig = {
        contentBase: config.outputPath,
        hot: true,
        inline: true,
        historyApiFallback: true,
        port: config.port,
        host: config.host,
        disableHostCheck: true,
        headers: {
            'Host': config.host,
            'Access-Control-Allow-Origin': '*'
        },
        proxy: {
            '**': `http://${config.host}`,
        },
        staticOptions: {
            '**': `http://${config.host}`,
        },
        stats: {
            chunks: false,
            colors: true
        },
    };

    // Merge with custom
    devServerConfig = _.merge(devServerConfig, config.devServer);

    return devServerConfig;
};
