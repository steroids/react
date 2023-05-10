import * as React from 'react';

import _isObject from 'lodash-es/isObject';
import _isString from 'lodash-es/isString';
import {useComponents} from '../../../hooks';

/**
 * Install the latest free version of Font Awesome via yarn:
 * ```
 * $ yarn add @fortawesome/fontawesome-free
 * ```
 *
 * in your root style file (e.g. index.scss) import fontawesome styles
 * ```
 *  @import "~@fortawesome/fontawesome-free/scss/fontawesome";
 * ```
 *
 * and in hoc @application add the following code
 * ```
 *   ui.addIcons(getFontAwesomeIcons())
 * ```
 *
 * That get the icon used <Icon name={'icon-name'} />
 */

export interface IIconProps {
    /**
     * Имя иконки (латиницей). Импорт иконок происходит на старте приложения.
     * @example create
     */
    name?: string,

    /**
     * Заголовок, отображаемый при наведении (через нативное поле title)
     * @example Добавить запись
     */
    title?: string,

    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;

    /**
    *  Должен ли данный элемент участвовать в последовательной навигации
    */
    tabIndex?: number,

    onClick?: any,

    [key: string]: any,
}

export interface IIconViewProps extends IIconProps {
    /**
     * @example require('icon.png'), <svg .../>, 'https://<site-name>/icon.png
     */
    icon: string,
}

export default function Icon(props: IIconProps): JSX.Element {
    const components = useComponents();

    const name = props.name;
    if (!_isString(name)) {
        return null;
    }

    let icon;

    if (process.env.PLATFORM === 'mobile') {
        icon = components.ui.getIcon(name) || name;
    } else {
        icon = name.indexOf('<svg') === 0 || name.indexOf('http') === 0
            ? name
            : components.ui.getIcon(name);

        if (_isObject(icon) && _isString(icon.default)) {
            icon = icon.default;
        }

        // Fix width attribute in icon
        if (_isString(icon) && icon.indexOf('<svg') === 0) {
            const match = icon.match(/<svg([^>]+)/);
            if (match && match[0].indexOf('width') === -1) {
                icon = icon.replace(match[0], match[0] + ' width=16');
            }
        }

        if (!icon) {
            // eslint-disable-next-line no-console
            console.warn('Not found icon with name "' + name + '"');
            icon = components.ui.getIcon('default_24x24');
        }
    }

    return components.ui.renderView(props.view || 'content.IconView', {
        ...props,
        icon,
    });
}
