import React from 'react';
import { useComponents } from '@steroidsjs/core/hooks';
// import { Size } from './SizeContext'

interface IAvatarProps {
    avatarUrl?: string,
    title?: string,
    src?: React.ReactNode,
    srcSet?: string;
    alt?: string,
    size?: Size,
    shape?: 'circle' | 'square',
    className?: CssClassName,
    view?: any
    children?: React.ReactNode,
    style?: React.CSSProperties,
}

export interface IAvatarViewProps extends IAvatarProps {
    
}

export type Size = 'large' | 'medium' | 'small' | number;

function Avatar (props: IAvatarProps) {
    const components = useComponents()
    return components.ui.renderView(props.view || 'content.AvatarView', {
        ...props
    });
}

Avatar.defaultProps = {
    size: 'medium',
    shape: 'circle',
}

export default Avatar;