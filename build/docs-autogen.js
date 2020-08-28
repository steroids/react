const path = require('path');
const typedocModule = require('typedoc');
const _ = require('lodash');
const fs = require('fs');
const {getInfo, getProperty, typeToObject, typeToString} = require('./helpers');

const app = new typedocModule.Application();
const {inputFiles} = app.bootstrap({
    ignoreCompilerErrors: true,
    includeDeclarations: true,
    excludeExternals: true,
    inputFiles: [
        path.resolve(__dirname, '../hoc'),
        path.resolve(__dirname, '../ui'),
        path.resolve(__dirname, '..'),
    ],
    tsconfig: path.resolve(__dirname, '../tsconfig.json'),
});

const src = app.expandInputFiles(inputFiles);
//src.push(path.resolve(__dirname, '../index.d.ts'));filesMap
//console.log(src);
const project = app.convert(src);
const filesMap = {};
project.files.forEach(file => {
    filesMap[file.fileName] = file.fullFileName;
})

const json = project ? app.serializer.projectToObject(project) : null;
if (!json || app.logger.hasErrors()) {
    return;
}
fs.writeFileSync(path.resolve(__dirname, 'docs-autogen-raw.json'), JSON.stringify(json, null, '    '));
//const json = JSON.parse(require('fs').readFileSync(__dirname + '/docs-autogen-raw.json'));

// Store components by file path
const components = {};
json.children.forEach(moduleItem => {
    if (moduleItem.kindString === 'Module' && moduleItem.flags && moduleItem.flags.isExported === true) {
        (moduleItem.children || []).forEach(item => {
            const moduleName = JSON.parse(moduleItem.name);
            if (item.kindString === 'Class' && moduleItem.flags && moduleItem.flags.isExported === true) {
                components[moduleName] = getInfo(filesMap, moduleItem, item);
            }
        });
    }
});

// Store docs
const docs = {
    interfaces: {},
    declarations: {},
    demos: {},
    components,
};
json.children.forEach(file => {
    (file.children || []).forEach(item => {
        if (item.flags && item.flags.isExported === true) {
            if (item.kindString === 'Interface') {
                docs.interfaces[item.name] = getInfo(filesMap, file, item);
            }
            if (item.kindString === 'Type alias') {
                docs.declarations[item.name] = getProperty(item);
            }
        }
    });

    const demoMatch = file.name.match(/ui\/(.+)\/demo\/([^\/]+)\"$/);
    if (demoMatch) {
        const path = demoMatch[1].split('\/');
        const name = demoMatch[2];

        if (!file.children) {
            let order = 0;
            let col = null;
            let description = null;
            let title = null;

            const fileContents = fs.readFileSync(file.originalName).toString();

            const matchOrderTagPattern = /@order\s(.*)$/gmi;
            const matchColTagPattern = /@col\s(.*)$/gmi;
            const matchCommentPattern = /[^import]\s\*\s[^@](.*)/gmi;

            const tagMatch = fileContents.match(matchOrderTagPattern);
            if (tagMatch) {
                order = tagMatch[0].replace('@order', '').trim();
            }

            const colMatch = fileContents.match(matchColTagPattern);
            if (colMatch) {
                col = colMatch[0].replace('@col', '').trim();
            }

            const commentMatch = fileContents.match(matchCommentPattern);
            if (commentMatch) {
                description = commentMatch.map(cm => cm.replace('*', '').trim()).join('\n')
            }

            // Store, if not empty
            if (order > 0 || title || description) {
                _.set(docs.demos, path.concat(name), {
                    order,
                    col,
                    title,
                    description,
                });
            }
        }

        // Store title, ..
        /*const {title, description, tags} = findClassDocs(file.children);
        if (title || description) {
            _.set(docs.demos, path.concat(name), {
                order: _.toInteger(tags['order']),
                col: _.toInteger(tags['col']),
                title,
                description,
            });
        }*/
    }
});

fs.writeFileSync(path.resolve(__dirname, 'docs-autogen-result.json'), JSON.stringify(docs, null, '    '));
