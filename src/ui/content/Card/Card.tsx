import React from 'react';
import { useComponents } from '@steroidsjs/core/hooks';

type cardType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' ;
type borderType = 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' ;

interface ICardProps {
    view?: any,
    children?: React.ReactNode,
    title?: string,
    description?: string,
    className?: CssClassName,
    cover?: string,
    orientation?: 'vertical' | 'vertical-reverse' | 'horizontal',
    shape?: 'square' | 'circle',
    style?: React.CSSProperties,
    header?: string,
    footer?: string,
    cardStyle?: cardType,
    borderStyle?: borderType | React.CSSProperties | boolean,
}

export interface ICardViewProps extends ICardProps {
    
}

function Card (props: ICardProps) {
    const components = useComponents()
    return components.ui.renderView(props.view || 'content.CardView', {
        ...props
    });
}

Card.defaultProps = {
    orientation: 'vertical',
    shape: 'circle',
    borderStyle: 'default',
}

export default Card;