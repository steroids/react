import _isString from 'lodash-es/isString';

export interface IHtmlComponent {
    /**
     * Утилита для создания css-классов по БЭМ
     */
    bem(blockName: string): any;

    /**
     * Метод для соединения нескольких classNames
     */
    classNames(...names: string[]): string;

    /**
     * Метод для добавления css-класса к элементу
     * @param node Элемент, к которому нужно добавить класс
     * @param className Название класса
     */
    addClass(node: React.ReactNode, className: string): void;

    /**
     * Метод для удаления css-класса у элемента
     * @param node Элемент, у которого нужно удалить класс
     * @param className Название класса
     */
    removeClass(node: React.ReactNode, className: string): void;

    closest(element: any, className: string): any;
}

/**
 * Html Component
 * Хелпер для работы с БЭМ классами и DOM элементами
 */
export default class HtmlComponent implements IHtmlComponent {
    _instances: any;

    namespace = '';

    constructor(components) {
        this._instances = {};
    }

    bem(blockName) {
        if (!this._instances[blockName]) {
            this._instances[blockName] = (...names) => this.classNames(...names);
            this._instances[blockName].block = modifiers => this._applyModifiers(blockName, modifiers);
            this._instances[blockName].element = (elementName, modifiers) => this._applyModifiers(
                blockName + '__' + elementName,
                modifiers,
            );
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
        // eslint-disable-next-line no-cond-assign
        while ((element = element.parentElement)
        // eslint-disable-next-line no-empty
        && !element.classList.contains(className)) {
        }
        return element;
    }

    private _applyModifiers(entity, modifiers) {
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
