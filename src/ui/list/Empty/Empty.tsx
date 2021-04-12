import * as React from 'react';
import {useComponents} from '../../../hooks';

export interface IEmptyProps {
    enable?: boolean,
    text?: string | React.ReactNode;
    className?: CssClassName;
    view?: CustomView,
    [key: string]: any,
}

export type IEmptyViewProps = IEmptyProps

function Empty(props: IEmptyProps) {
    const components = useComponents();

    if (!props.enable || props.list?.isLoading || props.list?.items?.length > 0) {
        return null;
    }

    return components.ui.renderView(props.view || 'list.EmptyView', props);
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
