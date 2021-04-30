import * as React from 'react';
import {useComponents} from '../../../hooks';

/**
 * Empty
 * Компонент используется в качестве заглушки в случае, когда пришла пустая коллекция данных.
 */
export interface IEmptyProps {
    /**
     * Показывать заглушку?
     * @example true
     */
    enable?: boolean,

    /**
     * Текст заглушки
     * @example 'Записи не найдены'
     */
    text?: string | React.ReactNode;

    /**
     * Дополнительный CSS-класс для элемента отображения
     */
    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView,
    [key: string]: any,
}

export type IEmptyViewProps = IEmptyProps

function Empty(props: IEmptyProps) {
    return useComponents().ui.renderView(props.view || 'list.EmptyView', props);
}

Empty.defaultProps = {
    enable: true,
    text: 'Записи не найдены',
};

export const normalizeEmptyProps = props => ({
    ...Empty.defaultProps,
    enable: !!props,
    text: __('Записи не найдены'),
    ...(typeof props === 'boolean'
        ? {enable: props}
        : (typeof props === 'string'
            ? {text: props}
            : props
        )
    ),
});

export default React.memo(Empty);
