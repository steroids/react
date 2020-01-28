const glob = require('glob-promise');
const _ = require('lodash');
const utils = require('./utils');

module.exports = {

    _entries: [],
    _config: {},
    _webpackConfig: {},

    config(value) {
        this._config = value;
        return this;
    },

    isProduction() {
        return utils.isProduction();
    },

    isSSR() {
        return utils.isSSR();
    },

    isTestSSR() {
        return utils.isTestSSR();
    },

    /**
     * Index js. Core module at first
     * @param {string} path
     * @return {exports}
     */
    base(path) {
        this._entries.push(
            glob(path)
                .then(files => {
                    // Core module at first
                    return files.sort(file => file.indexOf('app/core/') !== -1 ? -1 : 1);
                })
                .then(result => ({
                    index: result,
                }))
        );
        return this;
    },

    /**
     * Add any entry to webpack (js/css/...)
     * @param {string} path
     * @param {string} name
     * @returns {exports}
     */
    entry(path, name) {
        this._entries.push(
            glob(path)
                .then(result => ({
                    [name]: result
                }))
        );
        return this;
    },

    /**
     * Module styles
     * @param {string} path
     * @param {null|string} name
     * @return {exports}
     */
    styles(path, name = null) {
        if (typeof name === 'string') {
            this._entries.push(
                glob(path)
                    .then(result => ({
                        ['style' + (name ? '-' + name : '')]: result
                    }))
            );
        } else {
            this._entries.push(
                glob(path)
                    .then(result => result.reduce((obj, file) => {
                            const name = file.match(/([^\/]+)\.(less|scss)$/)[1].replace(/^index/, 'style');
                            obj[name] = obj[name] || [];
                            obj[name].push(file);
                            return obj;
                        }, {})
                    )
            );
        }
        return this;
    },

};
