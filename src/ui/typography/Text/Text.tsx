import {ReactNode, useMemo} from 'react';

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
    children?: ReactNode,

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
    color?: TypographyColorName,

    /** Текст
     * @example 'Simple text'
     */
    content?: string,
}

export type ITextViewProps = ITextProps

const defaultProps: ITextProps = {
    type: 'body',
};

export default function Text(receivedProps: ITextProps): JSX.Element {
    const props = useMemo(() => ({
        ...defaultProps,
        ...receivedProps,
    }), [receivedProps]);

    const components = useComponents();

    return components.ui.renderView(props.view || 'typography.TextView', {
        ...props,
    });
}
