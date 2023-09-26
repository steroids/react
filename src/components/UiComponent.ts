import * as React from 'react';

import _isFunction from 'lodash-es/isFunction';
import _isObject from 'lodash-es/isObject';
import _isString from 'lodash-es/isString';
import {ReactNode} from 'react';
import {IComponents} from '../providers/ComponentsProvider';

/**
 * Ui Component
 * Компонент для подгрузки и конфигурации UI компонентов приложения
 */
export interface IUiApplicationComponent {
    /**
    * Компоненты приложения.
    */
    components: IComponents;

    /**
    * Иконки для использования в приложении.
    */
    icons: {
        [name: string]: string | number | ReactNode
    };

    /**
    * Компоненты полей формы для использования в приложении.
    */
    fields: any;

    /**
    * Компоненты форматтеры для использования в приложении.
    */
    formatters: any;

    /**
    * Зарегистрированные компоненты полей формы.
    */
    _registeredFields: any;

    /**
    * Элемент портала.
    */
    _portalElement: HTMLElement | null;

    /**
     * Добавляет компоненты представлений.
     * @param {any} components - Компоненты представлений.
     */
    addViews(components: any): void;

    /**
     * Рендерит компонент представления.
     * @param {any} Component - Компонент или путь к компоненту представления.
     * @param {any} props - Свойства компонента.
     * @param {boolean} [forceNode=false] - Флаг, указывающий на принудительное отображение компонента как узла.
     * @returns {React.ReactElement<any>|null} Возвращает элемент React или null.
     */
    renderView(Component: any, props: any, forceNode?: boolean): React.ReactElement<any> | null;

    /**
     * Возвращает компонент представления по указанному пути.
     * @param {string} path - Путь к компоненту представления.
     * @returns {any} Компонент представления или undefined, если не найден.
     */
    getView(path: any): any;

    /**
     * Добавляет компоненты полей формы.
     * @param {any} components - Компоненты полей формы.
     */
    addFields(components: any): void;

    /**
     * Возвращает компонент поля формы по указанному пути.
     * @param {string} path - Путь к компоненту поля формы.
     * @returns {React.ComponentType<any>|undefined} Компонент поля формы или undefined, если не найден.
     */
    getField(path: string): React.ComponentType<any> | undefined;

    /**
     * Возвращает свойства конфигурации компонента поля формы по указанному пути.
     * @param {string} path - Путь к компоненту поля формы.
     * @param {any} model - Модель.
     * @param {any} attribute - Атрибут.
     * @returns {any} Свойства конфигурации компонента поля формы.
     */
    getFieldProps(path: string, model?: any, attribute?: any): any;

    /**
     * Добавляет компоненты форматтеров.
     * @param {any} components - Компоненты форматтеров.
     */
    addFormatters(components: any): void;

    /**
     * Возвращает компонент форматтера по указанному пути.
     * @param {string} path - Путь к компоненту форматтера.
     * @returns {React.ComponentType<any>|undefined} Компонент форматтера или undefined, если не найден.
     */
    getFormatter(path: string): React.ComponentType<any> | undefined;

    /**
     * Возвращает свойства конфигурации компонента форматтера по указанному пути.
     * @param {string} path - Путь к компоненту форматтера.
     * @returns {any} Свойства конфигурации компонента форматтера.
     */
    getFormatterProps(path: string): any;

    /**
     * Добавляет иконки.
     * @param {{ [name: string]: string | ReactNode }} icons - Иконки.
     */
    addIcons(icons: {[name: string]: string | ReactNode}): void;

    /**
     * Возвращает иконку по указанному имени.
     * @param {string} name - Имя иконки.
     * @returns {string | number | ReactNode | null} Иконка или null, если не найдена.
     */
    getIcon(name: string): string | number | ReactNode | null;

    /**
     * Добавляет модели.
     * @param {any} models - Модели.
     */
    addModels(models: any): void;

    /**
     * Регистрирует поле формы.
     * @param {string} formId - Идентификатор формы.
     * @param {string} attribute - Атрибут.
     * @param {any} type - Тип.
     */
    registerField(formId: string, attribute: string, type: any): void;

    /**
     * Возвращает зарегистрированные поля формы для указанного идентификатора формы.
     * @param {string} formId - Идентификатор формы.
     * @returns {any} Зарегистрированные поля формы.
     */
    getRegisteredFields(formId: string): any;

    /**
     * Задает элемент портала.
     * @param {HTMLElement} element - Элемент портала.
     */
    setPortalElement(element: HTMLElement): void;

    /**
     * Возвращает элемент портала.
     * @returns {HTMLElement | null} Элемент портала или null, если не задан.
     */
    getPortalElement(): HTMLElement | null;
}

/**
 * Ui Component
 * Компонент для подгрузки и конфигурации UI компонентов приложения
 */
export default class UiComponent implements IUiApplicationComponent {
    components: IComponents;

    _components: any;

    _models: any;

    icons: {[name: string]: string | number | ReactNode} | any;

    fields: any;

    formatters: any;

    _registeredFields: any;

    _portalElement: HTMLDivElement;

    constructor(components) {
        this.components = components;
        this.icons = {};
        this.fields = {};
        this.formatters = {};
        this._components = {};
        this._models = {};
        this._registeredFields = {};
        this._portalElement = null;
    }

    addViews(components) {
        this._add('views', components);
    }

    renderView(Component, props, forceNode = false) {
        if (_isString(Component)) {
            Component = this._getComponent('views', Component);
        }
        if (!forceNode && _isFunction(Component)) {
            if (Component.defaultProps) {
                return Component({...Component.defaultProps, ...props});
            }
            return Component(props);
        }
        return React.createElement(Component, props);
    }

    getView(path) {
        return this._getComponent('views', path);
    }

    addFields(components) {
        this._add('fields', components, 'form');
    }

    getField(path) {
        return this._getComponent('fields', path);
    }

    getFieldProps(path, model = null, attribute = null) {
        return {
            ...this._getPropsConfig('fields', path),
            ...this.components.meta.getModel(model)?.attributes?.[attribute],
        };
    }

    addFormatters(components) {
        this._add('formatters', components, 'format');
    }

    getFormatter(path) {
        return this._getComponent('formatters', path);
    }

    getFormatterProps(path) {
        return this._getPropsConfig('formatters', path);
    }

    addIcons(icons) {
        this.icons = icons;
    }

    getIcon(name) {
        if (_isFunction(this.icons)) {
            this.icons = this.icons();
        }
        return this.icons?.[name] || null;
    }

    addModels(models) {
        this._models = {...this._models, ...models};
    }

    /*getModel(name) {
        if (_isString(name)) {
            name = name.replace(/\\/g, '.').replace(/^\./, '');

            const model = this._models[name] || null;
            if (!model) {
                console.warn('Steroids: Not found model meta:', name); // eslint-disable-line no-console
            }
            return model;
        }
        return name || null;
    }*/

    registerField(formId, attribute, type) {
        if (!this._registeredFields[formId]) {
            this._registeredFields[formId] = {};
        }
        this._registeredFields[formId][attribute] = type;
    }

    getRegisteredFields(formId) {
        return this._registeredFields[formId] || null;
    }

    _add(group, items, defaultNamespace = null) {
        // require.context()
        if (_isFunction(items) && _isFunction(items.keys)) {
            items.keys().forEach(fileName => {
                const matches = fileName.match(/^\.\/(.*\/)?[^\\/]+\/([^\\/]+)\.(js|ts)x?$/);
                if (matches) {
                    const path = (matches[1] || '').replace(/\//g, '.') + matches[2];
                    this._components[group] = this._components[group] || {};
                    this._components[group][path] = items(fileName).default;
                }
            });
        } else if (_isObject(items)) {
            // object
            this._components[group] = this._components[group] || {};
            Object.keys(items).forEach(key => {
                const name = key.indexOf('.') === -1 && defaultNamespace
                    ? `${defaultNamespace}.${key}`
                    : key;
                this._components[group][name] = items[key];
            });
        } else {
            throw new Error(`Unsupported ${group} format for add component.`);
        }
    }

    _getComponent(group, path) {
        if (!this._components[group] || !this._components[group][path]) {
            throw new Error(`Not found '${group}' by path '${path}'.`);
        }

        // Lazy load component
        if (_isObject(this._components[group][path]) && this._components[group][path].lazy) {
            this._components[group][path] = this._components[group][path].lazy();
        }

        return this._components[group][path];
    }

    _getPropsConfig(group, path) {
        return (this[group] && this[group][path]) || null;
    }

    setPortalElement(element) {
        this._portalElement = element;
    }

    getPortalElement() {
        return this._portalElement;
    }
}
