import {memo, ReactNode, useMemo} from 'react';

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
    text?: string | ReactNode,

    [key: string]: any,
}

export type IEmptyViewProps = IEmptyProps

const defaultProps: IEmptyProps = {
    enable: true,
    text: 'Ничего не найдено',
};

function Empty(receivedProps: IEmptyProps): JSX.Element {
    const props = useMemo(() => ({
        ...defaultProps,
        ...receivedProps,
    }), [receivedProps]);

    return useComponents().ui.renderView(props.view || 'list.EmptyView', props);
}

export const normalizeEmptyProps = props => ({
    ...defaultProps,
    enable: !!props,
    text: __('Ничего не найдено'),
    ...(typeof props === 'boolean'
        ? {
            enable: props,
        }
        : (typeof props === 'string'
            ? {
                text: props,
            }
            : props
        )
    ),
});

export default memo(Empty);
