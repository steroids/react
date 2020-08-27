import * as React from 'react';

import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';
import _isString from 'lodash-es/isString';

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
interface IIconProps extends IComponentsHocOutput {
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
     * Переопределение view React компонента для кастомизациии отображения
     * @example MyCustomView
     */
    view?: React.ComponentType;
}

export interface IIconViewProps extends IIconProps {
    /**
     * @example require('icon.png'), <svg .../>, 'https://<site-name>/icon.png
     */
    icon: string,
}

@components('ui')
export default class Icon extends React.PureComponent<IIconProps> {

    render() {
        const IconView = this.props.view || this.props.ui.getView('icon.IconView');
        const name = this.props.name;
        let icon = name.indexOf('<svg') === 0 || name.indexOf('http') === 0
            ? name
            : this.props.ui.getIcon(this.props.name);

        // Fix width attribute in icon
        if (_isString(icon) && icon.indexOf('<svg') === 0) {
            const match = icon.match(/<svg([^>]+)/);
            if (match && match[0].indexOf('width') === -1) {
                icon = icon.replace(match[0], match[0] + ' width=16');
            }
        }

        return (
            <IconView
                {...this.props}
                icon={icon}
            />
        );
    }
}