import React from 'react';
import {useComponents} from '../../../hooks';

export interface ITextProps {
    view?: any,
    className?: CssClassName,

    /**
    * Дочерние элементы
    */
    children?: React.ReactNode,

    /**
     * Тип текста
     * @example {'body'}
     */
    type?: 'body' | 'span' | 'boldSpan' | string,

    /** HTML тег
     * @example {'span'}
     */
    tag?: 'p' | 'span' | string,

    /**
     * Цвет текста
     * @example {'primary'}
     */
    color?: ColorName,

    /** Текст
     * @example {'Simple text'}
     */
    content?: string,

    style?: React.CSSProperties,
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
