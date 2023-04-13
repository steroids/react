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
     * В каком случае закрывать Menu. По-умолчанию - `click-away`
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

    renderMenuItem: (item: IMenuItemProps) => React.ReactElement;
}

export interface IMenuViewProps extends IMenuProps {
    items: IMenuItemProps[];
    renderMenuItem: (item: IMenuItemProps) => React.ReactElement;
    className?: CssClassName;
    closeMode?: 'click-away' | 'click-any',
    icon?: string | React.ReactElement,
}

function Menu(props: IMenuProps): JSX.Element {
    const components = useComponents();
    const MenuItemView = components.ui.getView(props.view || 'content.MenuItemView');

    const renderMenuItems = React.useCallback(() => (
        <>
            {props.items.map((item, index) => (
                <MenuItemView
                    key={index}
                    {...item}
                />
            ))}
        </>
    ), [MenuItemView, props.items]);

    return components.ui.renderView(props.view || 'content.MenuView', {
        ...props,
        renderMenuItems,
    });
}

export default Menu;
