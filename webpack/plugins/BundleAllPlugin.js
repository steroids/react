const path = require('path');

/**
 * @param {Object} options
 * @constructor
 */
function BundleAllPlugin(options) {
    options = options || {};
    this.staticPath = options.staticPath || false;
}

BundleAllPlugin.prototype.apply = function(compiler) {

    const staticPath = this.staticPath;

    compiler.hooks.emit.tap('BundleAllPlugin', function (compilation) {
        const pathsOfBundles = [];
        const publicPath = compilation.outputOptions.publicPath;

        for (let assetName in compilation.assets) {

            if (/bundle-/.test(assetName)) {
                pathsOfBundles.push(publicPath + assetName);
            }
        }

        const scripts = pathsOfBundles.map((path, index) => {

            if (/.js$/.test(path)) {
                return `var script${index}=document.createElement("script");script${index}.src="${path}",script${index}.type="text/javascript",script${index}.async=true,document.getElementsByTagName("body")[0].appendChild(script${index});`;

            }

            if (/.css$/.test(path)) {
                return `var link=document.createElement("link");link.rel="stylesheet",link.href="${path}",document.getElementsByTagName("head")[0].appendChild(link);`;
            }

            return null;
        }).sort().filter(Boolean);


        const bundleAll = scripts.join('\n');

        compilation.assets[path.join(staticPath || '', 'bundle-all.js')] = {
            source: function() {
                return bundleAll;
            },
            size: function() {
                return bundleAll.length;
            }
        };
    });
};

module.exports = BundleAllPlugin;
