/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

import FooterIcons from './FooterIconsMockView';
import SidebarLogo from './SidebarLogoMockView';
import SidebarUser from './SidebarUserMockView';
import useBem from '../../../../src/hooks/useBem';
import {ISidebarViewProps} from '../../../../src/ui/layout/Sidebar/Sidebar';
import {Nav} from '../../../../src/ui/nav';

export default function SidebarView(props: ISidebarViewProps) {
    const bem = useBem('SidebarView');

    return (
        <aside
            className={bem(
                bem.block({
                    isOpened: props.isOpened,
                    hasSeparatedItem: props.hasSeparatedNavItem,
                }),
                props.className,
            )}
            style={props.style}
        >
            <header className={bem.element('header')}>
                <SidebarLogo
                    icon={props.logo?.icon as string}
                    label={props.logo?.label as string}
                    toggleSidebar={props.toggleSidebar}
                />
                <SidebarUser
                    menu={props.menu}
                    name={props.user?.name as string}
                    picture={props.user?.picture as string}
                />
            </header>
            <Nav
                items={props.items}
                layout="icon"
                className={bem.element('nav')}
                onChange={props?.onClickNav}
            />
            <footer className={bem.element('footer')}>
                <FooterIcons
                    footerIcons={props.footerIcons}
                    isShink={!props.isOpened}
                />
            </footer>
            <div
                className={bem.element('trigger')}
                onClick={props.toggleSidebar}
            />
        </aside>
    );
}
