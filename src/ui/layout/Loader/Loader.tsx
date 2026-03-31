import {useMemo} from 'react';
import {useComponents} from '../../../hooks';

/**
 * ILoaderProps
 *
 * Компонент Loader представляет собой индикатор загрузки,
 * который может использоваться для обозначения процесса загрузки данных или выполнения операции.
 **/
export interface ILoaderProps {
    /**
     * Размер элемента
     * @default md
     */
    size?: Size,

    /**
     * Название цвета
     * @default primary
     */
    color?: 'basic' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'gradient' | string,
    [key: string]: any,
}

export type ILoaderViewProps = ILoaderProps;

export default function Loader(props: ILoaderProps): JSX.Element {
    const viewProps = useMemo(() => ({
        size: 'sm',
        color: 'gradient',
        ...props,
    }), [props]);

    return useComponents().ui.renderView(props.view || 'layout.LoaderView', viewProps);
}
