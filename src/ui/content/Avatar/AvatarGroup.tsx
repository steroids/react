import React from 'react';
import { useComponents } from '@steroidsjs/core/hooks';
import {Avatar} from '@steroidsjs/core/ui/content/Avatar';

interface AvatarGroupProps{
    view?: any,
    // children?: React.ReactNode,
    children: {Avatar},
    style?: React.CSSProperties,
    maxCount?: number,
}

export interface IAvatarGroupViewProps extends AvatarGroupProps {
    
}

function AvatarGroup (props: AvatarGroupProps) {
    const components = useComponents()
    return components.ui.renderView(props.view || 'content.AvatarGroupView', {
        ...props
    });
}

AvatarGroup.defaultProps = {

}

export default AvatarGroup;