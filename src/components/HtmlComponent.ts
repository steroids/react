import _isString from 'lodash-es/isString';

/**
 * Html Component
 * Хелпер для работы с БЭМ классами и DOM элементами
 */
export default class HtmlComponent {
    _instances: any;

    namespace = '';

    constructor(components) {
        this._instances = {};
    }

    bem(blockName) {
        if (!this._instances[blockName]) {
            this._instances[blockName] = (...names) => this.classNames(...names);
            this._instances[blockName].block = modifiers => this._applyModifiers(blockName, modifiers);
            this._instances[blockName].element = (elementName, modifiers) => this._applyModifiers(blockName + '__' + elementName, modifiers);
        }
        return this._instances[blockName];
    }

    classNames(...names) {
        return Array.prototype.slice
            .call(names)
            .filter(v => v)
            .join(' ');
    }

    addClass(node, className) {
        if (node && _isString(node.className)) {
            const classes = node.className.split(' ');
            if (classes.indexOf(className) === -1) {
                classes.push(className);
                node.className = classes.join(' ');
            }
        }
    }

    removeClass(node, className) {
        if (node && _isString(node.className)) {
            const classes = node.className.split(' ');
            const index = classes.indexOf(className);
            if (index !== -1) {
                classes.splice(index, 1);
                node.className = classes.join(' ');
            }
        }
    }

    closest(element, className) {
        while ((element = element.parentElement)
        && !element.classList.contains(className)) {
        } // eslint-disable-line no-empty
        return element;
    }

    _applyModifiers(entity, modifiers) {
        let result = [];
        result.push(entity);
        if (typeof modifiers === 'string') {
            result.push(entity + (modifiers ? '_' + modifiers : ''));
        } else if (modifiers) {
            Object.keys(modifiers).forEach(key => {
                const value = modifiers[key];
                if (!value) {
                    // Skip
                } else if (value === true) {
                    result.push(entity + '_' + key);
                } else {
                    result.push(entity + '_' + key + '_' + value);
                }
            });
        }

        // Append namespace
        result = result.map(cl => this.namespace + cl);
        return result.join(' ');
    }
}
