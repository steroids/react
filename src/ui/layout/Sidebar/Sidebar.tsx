import React, {useCallback, useState} from 'react';
import {IMenuProps} from '../../content/Menu/Menu';
import {INavItem} from '../../nav/Nav/Nav';
import {IIconProps} from '../../content/Icon/Icon';
import {useComponents} from '../../../hooks';

export interface ISidebarItem extends INavItem {
    /**
    * Наличие верней границы у элемента
    */
    border?: boolean,
}
/**
* Sidebar
*
* Компонент Sidebar представляет собой боковое меню с возможностью гибкой настройки
*/
export interface ISidebarProps extends IUiComponent {
    /**
     * Объект с информацией о логотипе.
     */
    logo?: {
        /**
         * Текст или React-элемент для отображения логотипа.
         */
        label: string;
        /**
         * Путь к иконке или React-элемент для отображения иконки логотипа.
         */
        icon: string | React.ReactElement;
    };

    /**
     * Объект с информацией о пользователе.
     */
    user?: {
        /**
         * URL изображения пользователя.
         */
        picture: string;
        /**
         * Имя пользователя.
         */
        name: string;
    };

    /**
     * Props для компонента Menu.
     */
    menu?: IMenuProps;

    /**
     * Элементы навигации для компонента Nav.
     */
    items?: ISidebarItem[];

    /**
     * Флаг, определяющий, следует ли разделять элементы навигации.
     */
    hasSeparatedNavItem?: boolean;

    /**
     * Массив объектов с информацией об иконках для футера.
     */
    footerIcons?: IIconProps[];

    /**
     * Флаг, определяющий, будет ли сайдбар открытым по умолчанию.
     */
    isOpenedByDefault?: boolean;

    /**
     * Callback-функция, вызывается при клике на элемент навигации.
     * @param itemId - идентификатор элемента навигации, по которому произошел клик.
     */
    onClickItem?: (itemId: number) => void;

    // Другие свойства, которые могут быть переданы динамически.
    [key: string]: any;
}

export interface ISidebarViewProps extends ISidebarProps {
    isOpened: boolean;
    toggleSidebar: VoidFunction,
    onClickNav: (itemId: number) => void,
}

export default function Sidebar(props: ISidebarProps) {
    const components = useComponents();
    const [isOpened, setIsOpened] = useState(props.isOpenedByDefault);

    const toggleSidebar = useCallback(() => {
        const newState = !isOpened;
        setIsOpened(newState);
    }, [isOpened]);

    const onClickNav = React.useCallback((itemId: number) => {
        if (props?.onClickItem) {
            props.onClickItem(itemId);
        }
    }, [props]);

    return components.ui.renderView(props.view || 'layout.SidebarView', {
        ...props,
        isOpened,
        toggleSidebar,
        onClickNav,
    });
}

Sidebar.defaultProps = {
    hasSeparatedNavItem: false,
    isOpenedByDefault: true,
};
