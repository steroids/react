import React from 'react';
import {useComponents} from '../../../hooks';

/**
* Text
*
* Компонент для вывода текстового содержимого, с возможностью настройки тэгов, цвета и типа
*/
export interface ITextProps extends IUiComponent {
    /**
    * Дочерние элементы
    */
    children?: React.ReactNode,

    /**
     * Тип текста
     * @example 'body'
     */
    type?: 'body' | 'body2' | 'span' | 'boldSpan' | string,

    /** HTML тег
     * @example 'span'
     */
    tag?: 'p' | 'span' | string,

    /**
     * Цвет текста
     * @example 'primary'
     */
    color?: ColorName,

    /** Текст
     * @example 'Simple text'
     */
    content?: string,
}

export type ITextViewProps = ITextProps

function Text(props: ITextProps): JSX.Element {
    const components = useComponents();

    return components.ui.renderView(props.view || 'typography.TextView', {
        ...props,
    });
}

Text.defaultProps = {
    type: 'body',
};

export default Text;
