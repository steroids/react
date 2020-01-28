const path = require('path');

module.exports = {

    generatePort() {
        return path.basename(process.cwd())
            .split('')
            .reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
            }, 0)
            .toString()
            .replace(/^-|/, '5')
            .replace(/([0-9]{4}).*/, '$1');
    },

    getArgv(name) {
        return (process.argv.slice(2).find(a => a.match(new RegExp('(--)?' + name), 'i') !== null) || '').replace(/^.+=/, '');
    },

    isProduction() {
        return process.argv.slice(2).filter(a => a.match(/(--)?production/i) !== null).length > 0;
    },

    isSSR() {
        return !this.isTestSSR() && process.argv.slice(2).filter(a => a.match(/(--)?ssr/i) !== null).length > 0;
    },

    isTestSSR() {
        return process.argv.slice(2).filter(a => a.match(/(--)?ssr-test/i) !== null).length > 0;
    },

    isAnalyze() {
        return !this.isProduction() && process.argv.slice(2).filter(a => a.match(/(--)?analyze/i) !== null).length > 0;
    },

};
