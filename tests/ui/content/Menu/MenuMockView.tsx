import {useCallback} from 'react';
import {useBem} from '../../../../src/hooks';
import DropDown from '../../../../src/ui/content/DropDown';
import {IMenuViewProps} from '../../../../src/ui/content/Menu/Menu';
import renderIcon from '../../../mocks/renderIconMock';
import Icon from '../Icon/IconMockView';

export default function MenuView(props: IMenuViewProps) {
    const bem = useBem('MenuView');
    const MenuItemView = props.itemView;

    const renderMenuItems = useCallback(() => (
        <>
            {props.items.map((item, index) => (
                <MenuItemView
                    key={index}
                    {...item}
                />
            ))}
        </>
    ), [MenuItemView, props.items]);

    return (
        <DropDown
            {...props.dropDownProps}
            className={bem(bem.block(), props.className)}
            content={renderMenuItems}
        >
            <span className={bem.element('button')}>
                {props.icon
                    ? renderIcon(props.icon, {className: bem.element('icon')})
                    : (
                        <Icon
                            icon='mockIcon'
                            className={bem.element('icon')}
                        />
                    )}
            </span>
        </DropDown>
    );
}
