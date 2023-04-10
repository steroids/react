import React, {useRef} from 'react';
import {IAbsolutePositioningInputProps} from '../../../hooks/useAbsolutePositioning';
import useComponents from '../../../hooks/useComponents';
import DropDown from '../DropDown';

export interface IMenuItemViewProps {
    label: string,
    onClick?: VoidFunction,

    /**
     * Кастомная иконка, заменяющая первый роут
     */
    icon?: string | React.ReactElement,

    hasBorder?: boolean,
}

export interface IMenuProps extends IAbsolutePositioningInputProps {
    items: IMenuItemViewProps[],

    icon?: string | React.ReactNode,

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
    // const forwardedRef = useRef(null);
    // const DropDownView = components.ui.getView('content.DropDownView');
    const MenuItemView = components.ui.getView('content.MenuItemView');
    const MenuButtonView = components.ui.getView('content.MenuButtonView');

    const renderMenuItems = React.useCallback(() => (
        <>
            {props.items.map((item, index) => (
                <MenuItemView
                    key={index}
                    icon={item?.icon}
                    label={item.label}
                    onClick={item?.onClick}
                    hasBorder={item?.hasBorder}
                />
            ))}
        </>
    ), [MenuItemView, props.items]);

    return (
        <DropDown
            className={props.className}
            closeMode={props.closeMode}
            content={renderMenuItems}
            position={props.position}
        >
            <div style={{width: 'fit-content'}}>
                <MenuButtonView />
            </div>
        </DropDown>
    );
}

export default Menu;
