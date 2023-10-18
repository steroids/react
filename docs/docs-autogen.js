const path = require('path');
const typedocModule = require('typedoc');
const _ = require('lodash');
const fs = require('fs');
const {getInfo, getProperty, isComponent, changeDeclarationOnType} = require('./helpers/helpers');
const {addKeysToLocalesFiles} = require('./helpers/addKeysToLocalesFiles');

// locales
const enJson = require('./locales/en.json');

const localesMap = {
    en: enJson,
};

const app = new typedocModule.Application();

app.options.addReader(new typedocModule.TSConfigReader());

app.bootstrap({
    entryPoints: [
        path.resolve(__dirname, '../src/hooks'),
        path.resolve(__dirname, '../src/ui'),
        path.resolve(__dirname, '../src'),
    ],
    exclude: ['**/*.test.tsx', '**/*.test.ts', '**/*.story.js'],
    tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    excludeExternals: true,
});

const project = app.convert();
const filesMap = {};

project.files.forEach(file => {
    filesMap[file.fileName] = file.fullFileName;
});

const json = project ? app.serializer.projectToObject(project) : null;

if (!json || app.logger.hasErrors()) {
    return;
}

fs.writeFileSync(path.resolve(__dirname, 'docs-autogen-raw.json'), JSON.stringify(json, null, '    '));
//const json = JSON.parse(require('fs').readFileSync(__dirname + '/docs-autogen-raw.json'));

// Store components by file path
const demoPattern = /ui\/(.+?)\/demo\/(.*)/;
const components = {};
json.children.forEach(moduleItem => {
    if (moduleItem.kindString === 'Module' && !demoPattern.test(moduleItem.name)) {
        (moduleItem.children || []).forEach(item => {
            const moduleName = moduleItem.name;

            if (isComponent(item)) {
                components[moduleName] = getInfo(filesMap, moduleItem, item);
            }
        });
    }
});

// Store docs
const docs = {
    interfaces: {},
    declarations: {},
    components,
};
json.children.forEach(file => {
    (file.children || []).forEach(item => {
        if (item.kindString === 'Interface') {
            docs.interfaces[item.name] = getInfo(filesMap, file, item);
        }
        if (item.kindString === 'Type alias') {
            docs.declarations[item.name] = getProperty(item);
        }
    });
});

Object.entries(docs.interfaces).forEach(([interfaceName, interfaceData]) => {
    docs.interfaces[interfaceName] = changeDeclarationOnType(interfaceData, docs.declarations);
});

addKeysToLocalesFiles(docs, localesMap);

fs.writeFileSync(path.resolve(__dirname, 'docs-autogen-result.json'), JSON.stringify(docs, null, '    '));
