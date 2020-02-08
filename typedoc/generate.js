const path = require('path');
const typedocModule = require('typedoc');
const fs = require('fs');

const app = new typedocModule.Application();
const {inputFiles} = app.bootstrap({
    ignoreCompilerErrors: true,
    inputFiles: path.resolve(__dirname, '../ui'),
    tsconfig: path.resolve(__dirname, '../tsconfig.json'),
});

const src = app.expandInputFiles(inputFiles);
const project = app.convert(src);
const json = project ? app.serializer.projectToObject(project, {}) : null;
if (!json || app.logger.hasErrors()) {
    return;
}
//fs.writeFileSync(path.resolve(__dirname, 'result.json'), JSON.stringify(json, null, '    '));
//const json = JSON.parse(require('fs').readFileSync(__dirname + '/result.json'));

const typeToString = (type) => {
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

const docs = {};
json.children.forEach(file => {
    (file.children || []).forEach(item => {
        if (item.kindString === 'Interface' && item.flags && item.flags.isExported === true) {
            docs[item.name] = {
                name: item.name,
                description: !item.comment || typeof item.comment === 'string'
                    ? item.comment || ''
                    : item.comment.shortText,
                descriptionTags: typeof item.comment === 'object'
                    ? item.comment.tags
                    : [],
                extends: (item.extendedTypes || [])
                    .filter(ext => ext.type === 'reference')
                    .map(ext => ext.name),
                items: (item.children || [])
                    .filter(property => property.kindString === 'Property')
                    .map(property => ({
                        name: property.name,
                        required: !property.flags.isOptional,
                        type: typeToString(property.type),
                    })),
            };
        }
    });
});

fs.writeFileSync(path.resolve(__dirname, 'docs.json'), JSON.stringify(docs, null, '    '));
