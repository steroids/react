// See https://github.com/smrq/babel-plugin-require-context-hook/commit/955fb22c63f5518196328b4d87ce14176119dc30#diff-aa14e595e8e2b2c1e446e78d61539755

function context(
    basedir,
    directory,
    useSubdirectories = false,
    regExp = /^\.\//
) {
    const path = require('path');
    const fs = require('fs');

    function enumerateFiles(basedir, dir) {
        let result = [];
        fs.readdirSync(path.join(basedir, dir)).forEach(function(file) {
            const relativePath = dir + '/' + file;
            const stats = fs.lstatSync(path.join(basedir, relativePath));
            if (stats.isDirectory()) {
                if (useSubdirectories) {
                    result = result.concat(enumerateFiles(basedir, relativePath));
                }
            } else if (regExp.test(relativePath)) {
                result.push(relativePath);
            }
        });
        return result;
    }

    let absoluteDirectory = null;
    try {
        absoluteDirectory = path.dirname(require.resolve(directory));
    } catch(e) {}
    if (!absoluteDirectory) {
        absoluteDirectory = path.resolve(basedir, directory);
    }
    const keys = enumerateFiles(absoluteDirectory, '.');

    function requireContext(key) {
        if (!keys.includes(key)) {
            throw new Error(`Cannot find module '${key}'.`);
        }
        const fullKey = require('path').resolve(absoluteDirectory, key);
        return require(fullKey);
    }

    requireContext.keys = () => keys;

    return requireContext;
}

module.exports = function register() {
    global.__requireContext = context;
};
