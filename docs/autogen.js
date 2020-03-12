const path = require('path');
const typedocModule = require('typedoc');
const _ = require('lodash');
const fs = require('fs');

const app = new typedocModule.Application();
const {inputFiles} = app.bootstrap({
    ignoreCompilerErrors: true,
    inputFiles: [
        path.resolve(__dirname, '../hoc'),
        path.resolve(__dirname, '../ui'),
    ],
    tsconfig: path.resolve(__dirname, '../tsconfig.json'),
});

const src = app.expandInputFiles(inputFiles);
const project = app.convert(src);
const filesMap = {};
project.files.forEach(file => {
    filesMap[file.fileName] = file.fullFileName;
})

const json = project ? app.serializer.projectToObject(project) : null;
if (!json || app.logger.hasErrors()) {
    return;
}
fs.writeFileSync(path.resolve(__dirname, 'autogen-raw.json'), JSON.stringify(json, null, '    '));
//const json = JSON.parse(require('fs').readFileSync(__dirname + '/autogen-raw.json'));


const typeToString = (type) => {
    if (!type) {
        return null;
    }

    switch(type.type) {
        case 'intrinsic':
        case 'reference':
            return type.name;

        case 'stringLiteral':
            return JSON.stringify(type.value);

        case 'array':
            return typeToString(type.elementType) + '[]';

        case 'union':
            return type.types.map(subType => typeToString(subType)).join(' | ');

        case 'intersection':
            return type.types.map(subType => typeToString(subType)).join(' & ');

        case 'reflection':
            return '{' + (type.declaration.children || []).map(d => d.name + ': ' + typeToString(d.type)).join(', ') + '}';
    }

    throw new Error('Unknown type on convert to string: ' + JSON.stringify(type));
};

const docs = {
    interfaces: {},
    demos: {},
};
json.children.forEach(file => {
    (file.children || []).forEach(item => {
        if (item.kindString === 'Interface' && item.flags && item.flags.isExported === true) {
            let extendsList = [];
            if (filesMap[item.sources[0].fileName]) {
                const source = fs.readFileSync(filesMap[item.sources[0].fileName]);
                const extendsMatch = String(source).match(new RegExp(`interface\\s+${item.name}\\s+extends([^{]+)`));
                extendsList = extendsMatch ? extendsMatch[1].split(',').map(name => name.trim()) : [];
            }

            docs.interfaces[item.name] = {
                name: item.name,
                description: !item.comment || typeof item.comment === 'string'
                    ? item.comment || ''
                    : item.comment.shortText,
                descriptionTags: typeof item.comment === 'object'
                    ? item.comment.tags
                    : [],
                extends: extendsList,
                items: (item.children || [])
                    .filter(property => property.kindString === 'Property')
                    .map(property => ({
                        name: property.name,
                        description: _.get(property, 'comment.shortText', ''),
                        required: !property.flags.isOptional,
                        type: typeToString(property.type),
                        example: (_.get(property, 'comment.tags') || [])
                            .filter(tag => tag.tag === 'example')
                            .map(tag => tag.text)
                            .join(' ')
                    })),
            };
        }
    });

    const demoMatch = file.name.match(/ui\/(.+)\/demo\/([^\/]+)\"$/);
    if (demoMatch) {
        const path = demoMatch[1].split('\/');
        const name = demoMatch[2];
        (file.children || []).forEach(item => {
            if (item.kindString === 'Class') {
                // Get title and description
                const commentLines = _.get(item, 'comment.shortText', '').split('\n');
                const title = commentLines.length > 0 ? commentLines.shift() : demoMatch[2];
                const description = commentLines.join('\n');

                // Find order and col tags
                let order = 0;
                let col = null;
                _.get(item, 'comment.tags', []).forEach(tag => {
                    if (tag.tag === 'order') {
                        order = _.toInteger(tag.text.trim());
                    }
                    if (tag.tag === 'col') {
                        col = _.toInteger(tag.text.trim());
                    }
                });

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
        });
    }
});

fs.writeFileSync(path.resolve(__dirname, 'autogen-result.json'), JSON.stringify(docs, null, '    '));
