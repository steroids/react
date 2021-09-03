import {useComponents} from '../../../hooks';
import * as React from "react";

export interface ISkeletonViewProps {
    className?: string,
    children?: React.ReactNode,
    animation?: 'pulse' | 'wave',
    type?: 'text' | 'rect' | 'circle',
    height?: string | number,
    width?: string | number
}

interface ISkeletonProps {
    className?: string,
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
    type: 'text'
};

export default Skeleton;
