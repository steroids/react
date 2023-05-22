import React from 'react';
import useComponents from '../../../hooks/useComponents';
import {IDropDownProps} from '../DropDown/DropDown';

export interface IMenuItemProps {
    /**
     * Заголовок элемента меню
     */
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

export interface IMenuProps extends IUiComponent {
    /**
    *   Элементы меню
    */
    items: IMenuItemProps[],

    /**
    * Кастомная иконка, по клику на которую открывается меню
    */
    icon?: string | React.ReactElement,

    /**
     * Пропсы для DropDown
     */
    dropDownProps?: Omit<IDropDownProps, 'children' | 'content'>

    /**
     * Переопределение view React элемента меню для кастомизации отображения
     */
    itemView?: CustomView | any,
}

export type IMenuViewProps = IMenuProps;

function Menu(props: IMenuProps): JSX.Element {
    const components = useComponents();
    const MenuItemView = components.ui.getView(props.itemView || 'content.MenuItemView');

    return components.ui.renderView(props.view || 'content.MenuView', {
        ...props,
        itemView: MenuItemView,
    });
}

export default Menu;
