const _ = require('lodash');
const fs = require('fs');

const PROPS_INTERFACE_PATTERN = /^I\w+Props$/;
const PROPS_VIEW_INTERFACE_PATTERN = /^I\w+ViewProps$/;

const isUiComponent = (component) => PROPS_INTERFACE_PATTERN.test(component) && !PROPS_VIEW_INTERFACE_PATTERN.test(component);

const typeToString = (type) => {
    if (!type) {
        return null;
    }

    switch (type.type) {
        case 'intrinsic':
        case 'reference':
        case 'typeParameter':
        case 'typeOperator':
        case 'unknown':
            return type.name;

        case 'literal':
            return JSON.stringify(type.value);

        case 'array':
            return typeToString(type.elementType) + '[]';

        case 'tuple':
            return (type.types || type.elements).map(subType => typeToString(subType)).join(', ');

        case 'union':
            return type.types.map(subType => typeToString(subType)).join(' | ');

        case 'intersection':
            if (type.types[0].name === 'Omit') {
                return type.types[0].typeArguments[0].name;
            }
            return type.types.map(subType => typeToString(subType)).join(' & ');

        case 'reflection':
            return '{' + (type.declaration.children || []).map(d => d.name + ': ' + typeToString(d.type)).join(', ') + '}';
        default:
            throw new Error(`Unknown type on convert to string: ${JSON.stringify(type)}`);
    }
};

const typeToObject = type => {
    if (!type) {
        return null;
    }

    switch (type.kindString) {
        case 'Property':
            if (type.type.declaration) {
                return typeToObject(type.type.declaration);
            }
            return typeToString(type.type);

        case 'Function':
            return type.name + '()';

        case 'Variable':
            try {
                return JSON.parse(type.defaultValue);
            } catch (e) {
                return type.defaultValue;
            }

        case 'Type literal':
        case 'Object literal':
            // eslint-disable-next-line no-case-declarations
            const obj = {};
            (type.children || []).forEach(item => {
                obj[item.name] = item.defaultValue === '...'
                    ? typeToObject(item)
                    : item.defaultValue.trim();
            });
            return obj;
        default:
            throw new Error('Unknown type on convert to object: ' + JSON.stringify(type));
    }
};

const getComment = item => typeof item.comment === 'string'
    ? item.comment
    : [
        _.get(item, 'comment.shortText'),
        _.get(item, 'comment.text'),
    ].filter(Boolean).join('\n\n');

const getTags = item => {
    const tags = {};
    _.get(item, 'comment.tags', []).forEach(tag => {
        tags[tag.tag] = tag.text.trim();
    });
    return tags;
};

const getProperty = (property, isMethod = false) => ({
    name: property.name,
    decorators: (property.decorators || []).map(decorator => decorator.name),
    description: getComment(property),
    required: !isMethod && !property.flags.isOptional,
    type: typeToString(property.type),
    example: getTags(property).example || null,
});

const getInfo = (filesMap, moduleItem, item) => {
    if (!['Class', 'Interface', 'Type alias', 'Function', 'Property'].includes(item.kindString)) {
        return null;
    }

    const moduleName = moduleItem.name;
    const commentLines = getComment(item).split('\n');
    const info = {
        name: item.name,
        moduleName,
        title: commentLines.length > 0 ? commentLines.shift() : demoMatch[2],
        description: commentLines.join('\n'),
        tags: getTags(item),
    };

    // Find default props for React Components
    if (item.kindString === 'Interface') {
        info.defaultProps = null;

        if (isUiComponent(item.name)) {
            (moduleItem.children[0].children || []).forEach(property => {
                if (property.name === 'defaultProps') {
                    info.defaultProps = typeToObject(property.type.declaration);
                }
            });
        }

        info.extends = null;
        if (filesMap[item.sources[0].fileName]) {
            const source = fs.readFileSync(filesMap[item.sources[0].fileName]);
            const extendsMatch = String(source).match(new RegExp(`interface\\s+${item.name}\\s+extends([^{]+)`));
            info.extends = extendsMatch ? extendsMatch[1].split(',').map(name => name.trim()) : [];
        }
    }

    if (['Class', 'Interface'].includes(item.kindString)) {
        // Get properties
        info.properties = (item.children || [])
            .map(property => {
                // Check is property
                if (property.kindString !== 'Property') {
                    return false;
                }

                const propertyInfo = getProperty(property);

                if (isUiComponent(info.name)) {
                    const defaultValue = _.get(info, ['defaultProps', property.name]) || null;
                    _.set(propertyInfo, 'defaultValue', defaultValue);
                }

                // Skip props without jsdoc for components
                if (!propertyInfo.description && moduleName.match(/^components\//)) {
                    return false;
                }

                return propertyInfo;
            })
            .filter(Boolean);

        // Get methods
        info.methods = (item.children || [])
            .map(method => {
                // Check is property
                if (method.kindString !== 'Method') {
                    return false;
                }

                if (!method.signatures || method.signatures.length === 0) {
                    return false;
                }

                const methodInfo = getProperty(method.signatures[0], true);

                // Skip props without jsdoc for components
                if (!methodInfo.description && moduleName.match(/^components\//)) {
                    return false;
                }

                return {
                    ...methodInfo,
                    parameters: (method.signatures[0].parameters || []).map(param => getProperty(param)),
                };
            })
            .filter(Boolean);
    }

    return info;
};

const isComponent = (item) => {
    if (item.name !== 'default') {
        return false;
    }

    const {kindString, type} = item;

    return kindString === 'Class'
        || (kindString === 'Function' && _.get(item, 'signatures.0.type.name') === 'JSX.Element')
        || (kindString === 'Property' && (type.name === 'MemoExoticComponent' || type.name === 'FieldWrapperComponent'));
};

const changeDeclarationOnType = (interface, declarations) => {
    const cloneInterface = _.cloneDeep(interface);

    cloneInterface.properties.forEach(property => {
        if (Object.keys(declarations || {}).includes(property.type)) {
            property.type = declarations[property.type].type;
        }
    });

    return cloneInterface;
};

module.exports = {
    getInfo,
    getProperty,
    typeToObject,
    typeToString,
    isComponent,
    changeDeclarationOnType,
};
