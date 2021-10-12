const path = require('path');
const typedocModule = require('typedoc');
const _ = require('lodash');
const fs = require('fs');
const {getInfo, getProperty, isComponent} = require('./helpers');

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
    demos: {},
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

    const demoMatch = file.name.match(demoPattern);

    if (demoMatch) {
        const demoPath = demoMatch[1].split('/');
        const demoName = demoMatch[2];

        if (file.children) {
            let order = 0;
            let col = null;
            let description = null;
            const title = null;

            const fileContents = fs
                .readFileSync(path.resolve(__dirname, '../../../' + file.sources[0].fileName))
                .toString();

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
                description = commentMatch.map(cm => cm.replace('*', '').trim()).join('\n');
            }

            // Store, if not empty
            if (order > 0 || title || description) {
                _.set(docs.demos, demoPath.concat(demoName), {
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
            _.set(docs.demos, demoPath.concat(demoName), {
                order: _.toInteger(tags['order']),
                col: _.toInteger(tags['col']),
                title,
                description,
            });
        }*/
    }
});

fs.writeFileSync(path.resolve(__dirname, 'docs-autogen-result.json'), JSON.stringify(docs, null, '    '));
