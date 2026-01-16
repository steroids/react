import * as React from 'react';

import {useComponents} from '../../../hooks';

/**
 * Empty
 * Компонент используется в качестве заглушки в случае, когда пришла пустая коллекция данных.
 */
export interface IEmptyProps extends IUiComponent{
    /**
     * Показывать заглушку?
     * @example true
     */
    enable?: boolean,

    /**
     * Текст заглушки
     * @example 'Записи не найдены'
     */
    text?: string | React.ReactNode,

    [key: string]: any,
}

export type IEmptyViewProps = IEmptyProps

function Empty(props: IEmptyProps): JSX.Element {
    return useComponents().ui.renderView(props.view || 'list.EmptyView', props);
}

Empty.defaultProps = {
    enable: true,
    text: 'Ничего не найдено',
};

export const normalizeEmptyProps = props => ({
    ...Empty.defaultProps,
    enable: !!props,
    text: __('Ничего не найдено'),
    ...(typeof props === 'boolean'
        ? {enable: props}
        : (typeof props === 'string'
            ? {text: props}
            : props
        )
    ),
});

export default React.memo(Empty);
