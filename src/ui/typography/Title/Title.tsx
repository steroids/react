import React from 'react';
import {useComponents} from '../../../hooks';

export interface ITitleProps {
    view?: any,
    className?: CssClassName,

    /**
    * Дочерние элементы
    */
    children?: React.ReactNode,

    /**
     * Шаблон заголовка
     * @example {'h1'}
     */
    template?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle' | string,

    /** Соотношение шаблонов заголовков и HTML тегов
     * @example {h1: 'h1', h2: 'h2', subtitle: 'h6'}
     */
    templateMapping?: Record<string, string>,

    /** Текст заголовка
     * @example {'Simple text'}
     */
    content?: string,

    /**
     * Цвет заголовка
     * @example {'primary'}
     */
    color?: ColorName,

    style?: React.CSSProperties,
}

export type ITitleViewProps = ITitleProps

function Title(props: ITitleProps): JSX.Element {
    const components = useComponents();

    return components.ui.renderView(props.view || 'typography.TitleView', {
        ...props,
    });
}

Title.defaultProps = {
    template: 'h2',
    templateMapping: {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        h6: 'h6',
        subtitle: 'h6',
    },
    color: 'primary',
};

export default Title;
