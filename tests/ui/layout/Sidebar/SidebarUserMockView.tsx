import React, {memo} from 'react';

import useBem from '../../../../src/hooks/useBem';
import {Avatar} from '../../../../src/ui/content';
import Menu, {IMenuProps} from '../../../../src/ui/content/Menu/Menu';

interface ISidebarUserProps {
    menu: IMenuProps,
    name: string,
    picture: string,
}

function SidebarUser(props: ISidebarUserProps) {
    const bem = useBem('SidebarUser');

    return (
        <div className={bem.block()}>
            <div className={bem.element('left')}>
                <Avatar
                    size="sm"
                    src={props.picture}
                />
                <p className={bem.element('name')}>
                    {props.name}
                </p>
            </div>
            <Menu
                icon='mockIcon'
                {...props?.menu}
            />
        </div>
    );
}

export default memo(SidebarUser);
