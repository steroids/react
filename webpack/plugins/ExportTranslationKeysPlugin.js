'use strict';

const _get = require('lodash/get');
const _uniq = require('lodash/uniq');
const ConstDependency = require('webpack/lib/dependencies/ConstDependency');
const NullFactory = require('webpack/lib/NullFactory');
const path = require('path');
const fs = require('fs');
const translationKeys = {};

const getModulePath = module => {
    const deps = _get(module, 'buildInfo.fileDependencies');
    return deps ? deps.values().next().value : null;
};

const getModuleName = module => {
    const modulePath = getModulePath(module);
    const reg = modulePath.match('/app/(.+?)/.*') || modulePath.match('\\\\app\\\\(.+?)\\\\.*');
    return reg && reg[1] || null;
};

const getBundleName = module => {
    const modulePath = getModulePath(module);
    return modulePath ? path.basename(modulePath, '.js') : null;
};

const findRootModule = module => {
    while(true) {
        if (getModulePath(module.issuer)) {
            module = module.issuer;
        } else {
            break;
        }
    }
    return module;
};

/**
 * @param {Object} options
 * @constructor
 */
function ExportTranslationKeysPlugin(options) {
    options = options || {};
    this.mangleKeys = options.mangle || false;
}

ExportTranslationKeysPlugin.prototype.apply = function (compiler) {
    const mangleKeys = this.mangleKeys;
    const keys = this.keys = Object.create(null);

    compiler.hooks.compilation.tap('ExportTranslationKeysPlugin', function (compilation) {
        compilation.dependencyFactories.set(ConstDependency, new NullFactory());
        compilation.dependencyTemplates.set(ConstDependency, new ConstDependency.Template());
    });

    compiler.hooks.normalModuleFactory.tap('ExportTranslationKeysPlugin', function (factory) {
        factory.hooks.parser.for('javascript/auto').tap('ExportTranslationKeysPlugin', function (parser) {
            parser.hooks.call.for('__').tap('ExportTranslationKeysPlugin', function (expr) {
                if (expr.arguments.length === 0) {
                    return false;
                }

                const keyObject = parser.evaluateExpression(expr.arguments[0]);
                if (!keyObject.isString()) {
                    return false;
                }

                const keyString = keyObject.string;
                const rootModule = findRootModule(parser.state.current);
                const moduleName = getModuleName(rootModule);
                const bundleName = getBundleName(rootModule);

                translationKeys[bundleName] = translationKeys[bundleName] || {
                    translationKeys: [],
                    moduleName,
                    bundleName,
                };
                translationKeys[bundleName]['translationKeys'].push(keyString);

                return false;
            });
        });
    });

    compiler.hooks.done.tap('ExportTranslationKeysPlugin', function (stats) {
        if (!fs.existsSync(stats.compilation.outputOptions.path + '/assets')) {
            return;
        }

        const dir = stats.compilation.outputOptions.path + '/assets';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        let indexTranslations = [];
        Object.keys(translationKeys).forEach(bundleName => {
            const moduleName = translationKeys[bundleName].moduleName;
            if (!moduleName) {
                indexTranslations = indexTranslations.concat(translationKeys[bundleName].translationKeys);
            } else {
                const fileName = 'bundle-' + moduleName + '-' + translationKeys[bundleName].bundleName;

                const filePath = dir + '/' + fileName + '-lang.json';
                const arrayKeys = JSON.stringify(_uniq(translationKeys[bundleName].translationKeys));
                fs.writeFileSync(filePath, arrayKeys);
            }
        });

        if (indexTranslations.length > 0) {
            const filePath = dir + '/index-lang.json';
            fs.writeFileSync(filePath, JSON.stringify(_uniq(indexTranslations)));
        }
    });
};

module.exports = ExportTranslationKeysPlugin;
