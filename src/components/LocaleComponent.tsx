import * as React from 'react';
import IntlMessageFormat from 'intl-messageformat';
import moment from 'moment';
import _isObject from 'lodash-es/isObject';
import 'moment/locale/it';
import 'moment/locale/ru';

/**
 * Locale Component
 * Компонент для локализации приложения. Поддерживает конфигурацию языка и временной зоны
 *
 * Пример строки: `{__('{count} {count, plural, one{день} few{дня} many{дней}}', {count: 2})}`
 */
export default class LocaleComponent {
    backendTimeDiff: null;

    backendTimeZone: any;

    /**
     * Язык приложения
     * @example ru
     */
    language: string;

    sourceLanguage: string;

    translations: any;

    constructor(components, config) {
        this.language = config.language || 'en';
        this.sourceLanguage = config.sourceLanguage || 'ru';
        this.backendTimeZone = null;
        this.backendTimeDiff = null; // in microseconds
        this.translations = {};
        // Publish to global
        if (process.env.IS_SSR) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            global.__ = this.translate.bind(this);
        } else {
            window.__ = this.translate.bind(this);
        }
    }

    /**
     * Получение экземпляра `moment` с учетом временной зоны бекенда
     * @param date Дата
     * @param format Формат
     */
    moment(date: string = undefined, format: string = undefined) {
        if (date && this.backendTimeZone) {
            if (
                date.length === 16
                && moment(date, 'YYYY-MM-DD HH:mm').isValid()
            ) {
                date += ':00';
            }
            if (
                date.length === 19
                && moment(date, 'YYYY-MM-DD HH:mm:ss').isValid()
            ) {
                date += this.backendTimeZone;
            }
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
        Object.keys(params).forEach(key => {
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
        Object.keys(components).forEach(key => {
            const index = message.indexOf(`!!${key}!!`);
            if (index !== -1) {
                indexedComponents.push({
                    index,
                    component: components[key],
                });
            }
            message = message.replace(`!!${key}!!`, '!!component!!');
        });
        indexedComponents.sort((a, b) => {
            if (a.index < b.index) {
                return -1;
            } if (a.index > b.index) {
                return 1;
            }
            return 0;
        });
        // Split text to array, paste components
        const result = [];
        const textParts = message.split('!!component!!');
        for (let i = 0, j = 0; i < textParts.length; i += 1) {
            let isComponentAdded = false;
            if (
                j === 0
                && j < indexedComponents.length
                && indexedComponents[j].index === 0
            ) {
                result.push(
                    <span key={`element-${j}`}>{indexedComponents[j].component}</span>,
                );
                isComponentAdded = true;
                j += 1;
            }
            result.push(<span key={`text-${i}`}>{textParts[i]}</span>);
            if (!isComponentAdded && j < indexedComponents.length) {
                result.push(
                    <span key={`element${j}`}>{indexedComponents[j].component}</span>,
                );
                j += 1;
            }
        }
        return <span>{result}</span>;
    }
}
