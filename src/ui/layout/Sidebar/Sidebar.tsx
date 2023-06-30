import React from 'react';
import {IMenuProps} from 'src/ui/content/Menu/Menu';
import {INavItem, INavProps} from 'src/ui/nav/Nav/Nav';
import {IIconProps} from 'src/ui/content/Icon/Icon';
import {useComponents} from '../../../hooks';

interface ISidebarProps extends IUiComponent {
    logo?: {
        label: string;
        icon: string | React.ReactElement;
    },
    user?: {
        picture: string;
        name: string;
    },
    menu?: IMenuProps,
    navItems?: string | INavItem[],

    hasSeparatedNavItem?: boolean,

    footerIcons?: IIconProps[];

    [key: string]: any;
}

export type ISidebarViewProps = ISidebarProps

export default function Sidebar(props: ISidebarProps) {
    const components = useComponents();

    return components.ui.renderView(props.view || 'layout.SidebarView', {
        ...props,
    });
}

Sidebar.defaultProps = {
    hasSeparatedNavItem: false,
};
