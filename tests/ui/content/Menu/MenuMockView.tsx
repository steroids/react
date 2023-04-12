import React from 'react';
import {useBem} from '../../../../src/hooks';
import DropDown from '../../../../src/ui/content/DropDown';
import {IMenuProps} from '../../../../src/ui/content/Menu/Menu';
import renderIcon from '../../../mocks/renderIconMock';
import MenuItemView from './MenuItemMockView';

export default function MenuView(props: IMenuProps) {
    const bem = useBem('MenuView');

    const renderMenuItems = React.useCallback(() => (
        <>
            {props.items.map((item, index) => (
                <MenuItemView
                    key={index}
                    icon={item?.icon}
                    label={item.label}
                    onClick={item.onClick}
                    hasBorder={item?.hasBorder}
                />
            ))}
        </>
    ), [props.items]);

    return (
        <DropDown
            {...props}
            className="MenuView"
            closeMode={props.closeMode}
            content={renderMenuItems}
            position={props.position}
        >
            <span className={bem.element('button')}>
                {props.icon
                    ? renderIcon(props.icon, {className: bem.element('icon')})
                    : renderIcon('mockIcon', {className: bem.element('icon')})}
            </span>
        </DropDown>
    );
}
