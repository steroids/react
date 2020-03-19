import * as React from 'react';
import IntlMessageFormat from 'intl-messageformat';
import moment from 'moment';
import _isObject from 'lodash-es/isObject';
import 'moment/locale/it';
import 'moment/locale/ru';

// Fix load locale data
if (process.env.IS_SSR) {
    // @ts-ignore
    global.IntlMessageFormat = IntlMessageFormat;
    require('intl-messageformat/dist/locale-data/ru');
    // @ts-ignore
    delete global.IntlMessageFormat;
} else {
    // @ts-ignore
    window.IntlMessageFormat = IntlMessageFormat;
    require('intl-messageformat/dist/locale-data/ru');
    // @ts-ignore
    delete window.IntlMessageFormat;
}

/**
 * @example
 *  {__('{count} {count, plural, one{день} few{дня} many{дней}}', {count: 2})}
 */
export default class LocaleComponent {
    backendTimeDiff: null;
    backendTimeZone: any;
    language: any;
    sourceLanguage: string;
    translations: any;

    constructor(components) {
        this.language = 'en';
        this.sourceLanguage = 'ru';
        this.backendTimeZone = null;
        this.backendTimeDiff = null; // in microseconds
        this.translations = {};
        // Publish to global
        if (process.env.IS_SSR) {
            // @ts-ignore
            global.__ = this.translate.bind(this);
        } else {
            window.__ = this.translate.bind(this);
        }
    }

    moment(date, format = undefined) {
        if (
            this.backendTimeZone &&
            date &&
            date.length === 19 &&
            moment(date, 'YYYY-MM-DD HH:mm:ss').isValid()
        ) {
            date = date + this.backendTimeZone;
        }
        return moment(date, format).locale(this.language);
    }

    t(message, params = {}) {
        return this.translate(message, params);
    }

    translate(message, params = {}) {
        // Translate
        const hasTranslate = !!this.translations[message];
        message = this.translations[message] || message;

        // Cut react components
        const components = {};
        Object.keys(params).map(key => {
            if (_isObject(params[key])) {
                components[key] = params[key];
                params[key] = `!!${key}!!`;
            }
        });

        // Format message (params, plural, etc..)
        const language = hasTranslate ? this.language : this.sourceLanguage;
        const formatter = new IntlMessageFormat(message, language);
        message = formatter.format(params);

        // Paste react components
        message = this._pasteComponents(message, components);
        return message;
    }

    _pasteComponents(message, components) {
        if (Object.keys(components).length === 0) {
            return message;
        }
        // Index components
        const indexedComponents = [];
        Object.keys(components).map(key => {
            const index = message.indexOf(`!!${key}!!`);
            if (index !== -1) {
                indexedComponents.push({
                    index: index,
                    component: components[key]
                });
            }
            message = message.replace(`!!${key}!!`, '!!component!!');
        });
        indexedComponents.sort((a, b) => {
            if (a.index < b.index) {
                return -1;
            } else if (a.index > b.index) {
                return 1;
            }
            return 0;
        });
        // Split text to array, paste components
        const result = [];
        const textParts = message.split('!!component!!');
        for (let i = 0, j = 0; i < textParts.length; i++) {
            let isComponentAdded = false;
            if (
                j === 0 &&
                j < indexedComponents.length &&
                indexedComponents[j].index === 0
            ) {
                result.push(
                    <span key={`element-${j}`}>{indexedComponents[j].component}</span>
                );
                isComponentAdded = true;
                j++;
            }
            result.push(<span key={`text-${i}`}>{textParts[i]}</span>);
            if (!isComponentAdded && j < indexedComponents.length) {
                result.push(
                    <span key={`element${j}`}>{indexedComponents[j].component}</span>
                );
                j++;
            }
        }
        return <span>{result}</span>;
    }
}
