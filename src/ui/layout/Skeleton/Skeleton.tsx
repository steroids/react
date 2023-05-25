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
    /**
    * Дополнительные CSS классы
    * @example my-block
    */
    className?: CssClassName,

    /**
    * Дочерние элементы
    */
    children?: React.ReactNode,

    /**
    * Тип анимации
    */
    animation?: 'pulse' | 'wave',

    /**
    * Тип компонента
    */
    type?: 'text' | 'rect' | 'circle',

    /**
    * Высота элемента
    */
    height?: string | number,

    /**
    * Ширина элемента
    */
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
