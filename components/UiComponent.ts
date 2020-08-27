import _isFunction from 'lodash-es/isFunction';
import _isObject from 'lodash-es/isObject';
import {ReactNode} from "react";

/**
 * Ui Component
 * Компонент для подгрузки и конфигурации UI компонентов приложения
 */
export default class UiComponent {
    _components: any;
    icons: {[name: string]: string | number | ReactNode};
    fields: {};
    formatters: {};

    constructor(components) {
        this.icons = {};
        this.fields = {};
        this.formatters = {};
        this._components = {};
    }

    addViews(components) {
        this._add('views', components);
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

    getFieldProps(path) {
        return this._getPropsConfig('fields', path);
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
        return this.icons && this.icons[name] || null;
    }

    _add(group, items, defaultNamespace = null) {
        // require.context()
        if (_isFunction(items) && _isFunction(items.keys)) {
            items.keys().forEach(fileName => {
                const matches = fileName.match(/^\.\/(.*\/)?[^\/]+\/([^\/]+)\.(js|ts)x?$/);
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
                    ? defaultNamespace + '.' + key
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
        return this._components[group][path];
    }

    _getPropsConfig(group, path) {
        return (this[group] && this[group][path]) || null;
    }
}
