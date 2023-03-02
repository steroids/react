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
     * Шаблон текста
     * @example {'body1'}
     */
    template?: 'body' | 'span' | 'boldSpan' | string,

    /** Соотношение шаблонов текста и HTML тегов
     * @example {body1: 'p', body2: 'p', span: 'span'}
     */
    templateMapping?: Record<string, string>,

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
    template: 'body',
    templateMapping: {
        body1: 'p',
        body2: 'p',
        span: 'span',
        boldSpan: 'span',
    },
};

export default Text;
