const path = require('path');
const typedocModule = require('typedoc');
const _ = require('lodash');
const fs = require('fs');

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
//src.push(path.resolve(__dirname, '../index.d.ts'));
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
fs.writeFileSync(path.resolve(__dirname, 'autogen-raw.json'), JSON.stringify(json, null, '    '));
//const json = JSON.parse(require('fs').readFileSync(__dirname + '/autogen-raw.json'));


const typeToString = (type) => {
    if (!type) {
        return null;
    }

    switch (type.type) {
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
            if (type.types[0].name === 'Omit') {
                return type.types[0].typeArguments[0].name;
            }
            return type.types.map(subType => typeToString(subType)).join(' & ');

        case 'reflection':
            return '{' + (type.declaration.children || []).map(d => d.name + ': ' + typeToString(d.type)).join(', ') + '}';
    }

    throw new Error('Unknown type on convert to string: ' + JSON.stringify(type));
};

const typeToObject = type => {
    if (!type) {
        return null;
    }

    switch (type.kindString) {
        case 'Property':
            return typeToObject(type.type.declaration);

        case 'Variable':
            return JSON.parse(type.defaultValue);

        case 'Type literal':
        case 'Object literal':
            const obj = {};
            (type.children || []).forEach(item => {
                obj[item.name] = typeToObject(item);
            });
            return obj;
    }

    throw new Error('Unknown type on convert to string: ' + JSON.stringify(type));
};

// Store components by file path
const components = {};
json.children.forEach(moduleItem => {
    if (moduleItem.kindString === 'External module' && moduleItem.flags && moduleItem.flags.isExported === true) {
        (moduleItem.children || []).forEach(item => {
            if (item.kindString === 'Class' && moduleItem.flags && moduleItem.flags.isExported === true) {
                // Find default props
                let defaultProps = null;
                (item.children || []).forEach(property => {
                    if (property.name === 'defaultProps' && property.flags && property.flags.isExported === true) {
                        defaultProps = typeToObject(property);
                    }
                });

                components[JSON.parse(moduleItem.name)] = {
                    name: item.name,
                    decorators: (item.decorators || []).map(decorator => decorator.name),
                    defaultProps,
                };
            }
            if (item.kindString === 'Object literal' && item.name === 'defaultProps' && item.flags && item.flags.isConst === true) {
                components[JSON.parse(moduleItem.name)] = {
                    ...components[JSON.parse(moduleItem.name)],
                    defaultProps: typeToObject(item),
                };
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
        if (item.kindString === 'Interface' && item.flags && item.flags.isExported === true) {
            let extendsList = [];
            if (filesMap[item.sources[0].fileName]) {
                const source = fs.readFileSync(filesMap[item.sources[0].fileName]);
                const extendsMatch = String(source).match(new RegExp(`interface\\s+${item.name}\\s+extends([^{]+)`));
                extendsList = extendsMatch ? extendsMatch[1].split(',').map(name => name.trim()) : [];
            }

            docs.interfaces[item.name] = {
                name: item.name,
                moduleName: JSON.parse(file.name),
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
        if (item.kindString === 'Type alias' && item.flags && item.flags.isExported === true) {
            docs.declarations[item.name] = {
                name: item.name,
                description: !item.comment || typeof item.comment === 'string'
                    ? item.comment || ''
                    : item.comment.shortText,
                descriptionTags: typeof item.comment === 'object'
                    ? item.comment.tags
                    : [],
                type: typeToString(item.type),
                example: (_.get(item, 'comment.tags') || [])
                    .filter(tag => tag.tag === 'example')
                    .map(tag => tag.text)
                    .join(' '),
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
