import React from 'react';
import { useComponents } from '@steroidsjs/core/hooks';

interface ICardProps {
    view?: any,
    children?: React.ReactNode,
    title?: string,
    more?: React.ReactNode,
    bordered?: boolean | React.CSSProperties,
    className?: CssClassName,
    description?: React.ReactNode,
    cover?: React.ReactNode,
    actions?: React.ReactNode[],
    size?: Size,
    shape?: 'square' | 'circle',
    style?: React.CSSProperties,
}

export interface ICardViewProps extends ICardProps {
    
}

export type Size = 'large' | 'medium' | 'small';

function Card (props: ICardProps) {
    const components = useComponents()
    return components.ui.renderView(props.view || 'content.CardView', {
        ...props
    });
}

Card.defaultProps = {
    size: 'medium',
    shape: 'circle',
}

export default Card;