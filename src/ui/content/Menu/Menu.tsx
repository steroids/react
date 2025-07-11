import {ReactElement, useMemo} from 'react';
import useComponents from '../../../hooks/useComponents';
import {IDropDownProps} from '../DropDown/DropDown';

export interface IMenuItem {
    /**
     * Заголовок элемента меню
     */
    label: string,

    /**
     * Функция вызываемая при клике
     */
    onClick: VoidFunction,

    /**
     * Кастомная иконка
     */
    icon?: string | ReactElement,

    /**
     * Нижний border
     */
    hasBorder?: boolean,

    [key: string]: any,
}

/**
 * Menu
 *
 * Компонент-меню позволяет создавать выпадающие списки с элементами, которые могут быть выбраны
 * или выполнить определенные действия при клике на них.
 *
 * Компонент `Menu` обычно используется для создания навигационных меню или контекстных меню,
 * где пользователь может выбирать опции или выполнять определенные действия в зависимости от выбранного элемента.
 *
 * Компонент `Menu` принимает массив `items`, каждый элемент которого представляет собой отдельный пункт меню.
 * Каждый пункт меню имеет заголовок `label`, функцию `onClick`, которая будет вызываться при клике на элемент,
 * кастомную иконку `icon` (необязательно) и флаг `hasBorder`, определяющий наличие нижней границы у элемента.
 *
 * Примечание: Компонент `Menu` требует указания хотя бы одного элемента меню в свойстве `items`.
 */
export interface IMenuProps extends IUiComponent {
    /**
    *   Элементы меню
    */
    items: IMenuItem[],

    /**
    * Кастомная иконка, по клику на которую открывается меню
    */
    icon?: string | ReactElement,

    /**
     * Пропсы для DropDown
     */
    dropDownProps?: IDropDownProps,

    /**
     * Переопределение view React элемента меню для кастомизации отображения
     */
    itemView?: CustomView | any,
}

export type IMenuViewProps = IMenuProps;

function Menu(props: IMenuProps): JSX.Element {
    const components = useComponents();
    const MenuItemView = props.itemView || components.ui.getView('content.MenuItemView');

    const viewProps = useMemo(() => ({
        items: props.items,
        dropDownProps: props.dropDownProps,
        icon: props.icon,
        className: props.className,
        style: props.style,
        itemView: MenuItemView,
    }), [MenuItemView, props.className, props.dropDownProps, props.icon, props.items, props.style]);

    return components.ui.renderView(props.view || 'content.MenuView', viewProps);
}

export default Menu;
