import React from 'react';

import {useComponents} from '../../../hooks';

/**
* Title
*
* Компонент предназначен для вывода заголовков, предоставляет возможность для настройки, цвета, типа и тэга.
*/
export interface ITitleProps extends IUiComponent {
    /**
    * Дочерние элементы
    */
    children?: React.ReactNode,

    /**
     * Тип заголовка
     * @example 'h1'
     */
    type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle' | string,

     /** HTML тег
     * @example 'h2'
     */
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',

    /** Текст заголовка
     * @example 'Simple text'
     */
    content?: string,

    /**
     * Цвет заголовка
     * @example 'primary'
     */
    color?: ColorName,
}

export type ITitleViewProps = ITitleProps

function Title(props: ITitleProps): JSX.Element {
    const components = useComponents();

    return components.ui.renderView(props.view || 'typography.TitleView', {
        ...props,
    });
}

Title.defaultProps = {
    type: 'h2',
};

export default Title;
