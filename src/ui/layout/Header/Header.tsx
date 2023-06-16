import {IAvatarProps} from 'src/ui/content/Avatar/Avatar';
import {useComponents} from '../../../hooks';
import {INavProps} from '../../nav/Nav/Nav';

export interface IHeaderProps extends IUiComponent {
    /**
    * Свойства для логотипа
    */
    logo?: {
        title: string,
        linkProps?: Record<string, unknown>,
        icon?: string | React.ReactElement,
        className?: CssClassName,
    };

    /**
    * Свойства для навигации
    */
    nav?: Omit<INavProps, 'layout' | 'size'>;

    /**
     * Размер
     */
    size?: Size,

    /**
    * Параметр авторизации, если в качестве строки передать route то отобразится кнопка "Войти".
    * Если передать username и userAvatar - отобразятся данные пользователя.
    */
    auth?: string | {
        username: string,
        userAvatar: Omit<IAvatarProps, 'size'>,
    }

    [key: string]: any;
}

export type IHeaderViewProps = IHeaderProps

function Header(props: IHeaderProps): JSX.Element {
    return useComponents().ui.renderView(props.view || 'layout.HeaderView', props);
}

Header.defaultProps = {
    size: 'md',
    auth: null,
};

export default Header;
