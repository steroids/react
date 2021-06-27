const path = require('path');
const typedocModule = require('typedoc');
const _ = require('lodash');
const fs = require('fs');

const typeToString = (type) => {
    if (!type) {
        return null;
    }

    switch (type.type) {
        case 'intrinsic':
        case 'reference':
        case 'typeParameter':
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
            const obj = {};
            (type.children || []).forEach(item => {
                obj[item.name] = typeToObject(item);
            });
            return obj;
    }

    throw new Error('Unknown type on convert to object: ' + JSON.stringify(type));
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

/*const findClassDocs = (children) => {
    let title = null;
    let description = null;
    let tags = {};

    (children || []).forEach(item => {
        if (item.kindString === 'Class') {
            // Get title and description
            const commentLines = _.get(item, 'comment.shortText', '').split('\n');
            title = commentLines.length > 0 ? commentLines.shift() : demoMatch[2];
            description = commentLines.join('\n');

            // Find order and col tags
            let order = 0;
            let col = null;
            _.get(item, 'comment.tags', []).forEach(tag => {
                tags[tag.tag] = tag.text.trim();
            });
        }
    });

    return {title, description, tags};
};*/

const getProperty = property => ({
    name: property.name,
    decorators: (property.decorators || []).map(decorator => decorator.name),
    description: getComment(property),
    required: !property.flags.isOptional,
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
        (item.children || []).forEach(property => {
            if (property.name === 'defaultProps' && property.flags && property.flags.isExported === true) {
                info.defaultProps = typeToObject(property);
            }
        });
        (moduleItem.children || []).forEach(item => {
            if (item.kindString === 'Object literal' && item.name === 'defaultProps' && item.flags && item.flags.isConst === true) {
                info.defaultProps = {
                    ...info.defaultProps,
                    ...typeToObject(item),
                };
            }
        });

        info.extends = null;
        if (filesMap[item.sources[0].fileName]) {
            const source = fs.readFileSync(filesMap[item.sources[0].fileName]);
            const extendsMatch = String(source).match(new RegExp(`interface\\s+${item.name}\\s+extends([^{]+)`));
            info.extends = extendsMatch ? extendsMatch[1].split(',').map(name => name.trim()) : [];
        }
    }

    // Get properties
    if (['Class', 'Interface'].includes(item.kindString)) {
        info.properties = (item.children || [])
            .map(property => {
                // Check is property
                if (property.kindString !== 'Property') {
                    return false;
                }

                const propertyInfo = getProperty(property);

                // Skip props without jsoc for components
                if (!propertyInfo.description && moduleName.match(/^components\//)) {
                    return false;
                }

                return propertyInfo;
            })
            .filter(Boolean);
    }

    // Get methods
    if (item.kindString === 'Class') {
        info.methods = (item.children || [])
            .map(method => {
                // Check is property
                if (method.kindString !== 'Method') {
                    return false;
                }

                /*
                    "signatures": [
                        {
                            "id": 7631,
                            "name": "moment",
                            "kind": 4096,
                            "kindString": "Call signature",
                            "flags": {
                                "isExported": true
                            },
                            "comment": {
                                "shortText": "Получение экземпляра `moment` с учетом временной зоны бекенда"
                            },
                            "parameters": [
                                {
                                    "id": 7632,
                                    "name": "date",
                                    "kind": 32768,
                                    "kindString": "Parameter",
                                    "flags": {
                                        "isExported": true
                                    },
                                    "comment": {},
                                    "type": {
                                        "type": "intrinsic",
                                        "name": "any"
                                    },
                                    "defaultValue": "undefined"
                                },
                                {
                                    "id": 7633,
                                    "name": "format",
                                    "kind": 32768,
                                    "kindString": "Parameter",
                                    "flags": {
                                        "isExported": true
                                    },
                                    "comment": {
                                        "text": "\n"
                                    },
                                    "type": {
                                        "type": "intrinsic",
                                        "name": "any"
                                    },
                                    "defaultValue": "undefined"
                                }
                            ],
                            "type": {
                                "type": "intrinsic",
                                "name": "any"
                            }
                        }
                    ],
                 */

                if (!method.signatures || method.signatures.length === 0) {
                    return false;
                }

                const methodInfo = getProperty(method.signatures[0]);

                // Skip props without jsoc for components
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

module.exports = {
    getInfo,
    getProperty,
    typeToObject,
    typeToString,
    isComponent,
};
