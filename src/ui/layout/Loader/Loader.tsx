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
    */
    size?: Size;

    /**
     * Название цвета
     */
    color?: ColorName;
    [key: string]: any;
}

export type ILoaderViewProps = ILoaderProps;

export default function Loader(props: ILoaderProps): JSX.Element {
    return useComponents().ui.renderView(props.view || 'layout.LoaderView', props);
}
