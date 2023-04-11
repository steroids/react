import React from 'react';
import {IAbsolutePositioningInputProps} from '../../../hooks/useAbsolutePositioning';
import useComponents from '../../../hooks/useComponents';

export interface IMenuItemProps {
    label: string,
    /**
     * Функция при клике
     */
    onClick: VoidFunction,

    /**
     * Кастомная иконка
     */
    icon?: string | React.ReactElement,

    /**
     * Нижний border
     */
    hasBorder?: boolean,
}

export interface IMenuProps extends IAbsolutePositioningInputProps {
    items: IMenuItemProps[],

    icon?: string | React.ReactElement,

    /**
     * В каком случае закрывать DropDown. По-умолчанию - `click-away`
     * @example click-any
     */
    closeMode?: 'click-away' | 'click-any',

    /**
    * Дополнительный CSS-класс
    */
    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизации отображения
     */
    view?: CustomView;

    /**
     * Кастомные стили
     */
    style?: CustomStyle,
}

function Menu(props: IMenuProps): JSX.Element {
    const components = useComponents();
    return components.ui.renderView(props.view || 'content.MenuView', {
        ...props,
    });
}

export default Menu;
