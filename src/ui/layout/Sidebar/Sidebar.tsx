import React, {useCallback, useState} from 'react';
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
    items?: string | INavItem[],

    hasSeparatedNavItem?: boolean,

    footerIcons?: IIconProps[];
    isOpenedByDefault?: boolean;

    [key: string]: any;
}

export interface ISidebarViewProps extends Omit<ISidebarProps, 'isOpenedByDefault'> {
    isOpened: boolean;
    toggleSidebar: VoidFunction,
}

export default function Sidebar(props: ISidebarProps) {
    const components = useComponents();
    const [isOpened, setIsOpened] = useState(props.isOpenedByDefault);

    const toggleSidebar = useCallback(() => {
        setIsOpened(prev => !prev);
    }, []);

    return components.ui.renderView(props.view || 'layout.SidebarView', {
        ...props,
        isOpened,
        toggleSidebar,
    });
}

Sidebar.defaultProps = {
    hasSeparatedNavItem: false,
    isOpenedByDefault: true,
};
