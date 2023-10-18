const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const getPropertiesDescription = (properties) => properties
    ?.map(property => property.description)
    .filter(Boolean);

const getKeysToTranslationFromDocs = (docs) => {
    const uiComponentsDescriptions = Object.keys(docs.interfaces)
        .map(interfaceKey => docs.interfaces[interfaceKey].description)
        .filter(Boolean);

    const propsDescriptions = Object.keys(docs.interfaces)
        .map(interfaceKey => getPropertiesDescription(docs.interfaces[interfaceKey].properties))
        .filter(propertiesDescription => !!propertiesDescription.length);

    const declarationsDescriptions = Object.keys(docs.declarations)
        .map(declarationKey => docs.declarations[declarationKey].description)
        .filter(Boolean);

    const componentsDescriptions = Object.keys(docs.components)
        .map(componentKey => {
            const component = docs.components[componentKey];
            const componentsMethodsDescriptions = getPropertiesDescription(component.methods);
            const componentsPropertiesDescriptions = getPropertiesDescription(component.properties);

            return [
                component.description,
                ...componentsMethodsDescriptions || [],
                ...componentsPropertiesDescriptions || [],
            ];
        })
        .filter(Boolean);

    const keysToTranslation = [
        ...uiComponentsDescriptions,
        ...propsDescriptions.flat(1),
        ...declarationsDescriptions,
        ...componentsDescriptions.flat(1).filter(Boolean),
    ];

    return _.uniq(keysToTranslation);
};

const addKeysToLocalesFiles = (docs, localesMap) => {
    const keysToTranslation = getKeysToTranslationFromDocs(docs);

    Object.keys(localesMap).forEach((localeKey) => {
        const newKeysToTranslation = _.difference(keysToTranslation, Object.keys(localesMap[localeKey]));
        const newMapToTranslation = {};

        newKeysToTranslation.forEach(newKeyToTranslation => {
            newMapToTranslation[newKeyToTranslation] = '';
        });

        const translationMap = {
            ...localesMap[localeKey],
            ...newMapToTranslation,
        };

        fs.writeFileSync(path.resolve(__dirname, `../locales/${localeKey}.json`), JSON.stringify(translationMap, null, '    '));
    });
};

module.exports = {
    addKeysToLocalesFiles,
};
