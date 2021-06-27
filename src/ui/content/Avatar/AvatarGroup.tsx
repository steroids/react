import React from 'react';
import { useComponents } from '../../../hooks';

interface AvatarGroupProps{
    view?: any,
    // children?: React.ReactNode,
    children: {Avatar},
    style?: React.CSSProperties,
    maxCount?: number,
}

export type IAvatarGroupViewProps = AvatarGroupProps

function AvatarGroup(props: AvatarGroupProps) {
    const components = useComponents();
    return components.ui.renderView(props.view || 'content.AvatarGroupView', {
        ...props,
    });
}

AvatarGroup.defaultProps = {

};

export default AvatarGroup;
