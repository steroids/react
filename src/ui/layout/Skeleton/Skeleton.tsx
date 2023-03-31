import * as React from 'react';
import {useComponents} from '../../../hooks';

export interface ISkeletonViewProps {
    className?: CssClassName,
    children?: React.ReactNode,
    animation?: 'pulse' | 'wave',
    type?: 'text' | 'rect' | 'circle',
    height?: string | number,
    width?: string | number
}

export interface ISkeletonProps {
    className?: CssClassName,
    children?: React.ReactNode,
    animation?: 'pulse' | 'wave',
    type?: 'text' | 'rect' | 'circle',
    height?: string | number,
    width?: string | number
}

function Skeleton(props: ISkeletonProps): JSX.Element {
    return useComponents().ui.renderView('layout.SkeletonView', props);
}

Skeleton.defaultProps = {
    animation: 'pulse',
    type: 'text',
};

export default Skeleton;
