import {useComponents} from '../../../hooks';
import {INavProps} from '../../nav/Nav/Nav';

/**
 * IHeaderProps
 *
 * Компонент Header представляет собой верхнюю часть макета страницы.
 * Он может содержать логотип и навигацию, а также кастомизироваться с помощью переданного view React компонента.
 **/
export interface IHeaderProps extends IUiComponent {
    /**
    * Свойства для логотипа
    */
    logo?: {
        title: string,
        linkProps?: Record<string, unknown>,
        icon?: string | any,
        className?: CssClassName,
    };

    /**
    * Свойства для навигации
    */
    nav?: INavProps;

    /**
     * Размер
     */
    size?: Size,

    [key: string]: any;
}

export type IHeaderViewProps = IHeaderProps

export default function Header(props:IHeaderProps): JSX.Element {
    return useComponents().ui.renderView(props.view || 'layout.HeaderView', props);
}
