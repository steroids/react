import _isFunction from 'lodash-es/isFunction';
import _isObject from 'lodash-es/isObject';

export default class UiComponent {
    _components: any;
    fields: {};
    formatters: {};

    constructor(components) {
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
        this._add('fields', components);
    }

    getField(path) {
        return this._getComponent('fields', path);
    }

    getFieldProps(path) {
        return this._getPropsConfig('fields', path);
    }

    addFormatters(components) {
        this._add('formatters', components);
    }

    getFormatter(path) {
        return this._getComponent('formatters', path);
    }

    getFormatterProps(path) {
        return this._getPropsConfig('formatters', path);
    }

    _add(group, items) {
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
            this._components[group] = {
                ...this._components[group],
                ...items
            };
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
