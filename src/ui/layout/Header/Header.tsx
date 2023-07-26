import {IAvatarProps} from 'src/ui/content/Avatar/Avatar';
import {ILinkProps} from 'src/ui/nav/Link/Link';
import {IModalProps} from 'src/ui/modal/Modal/Modal';
import {IMenuProps} from 'src/ui/content/Menu/Menu';
import {useCallback, useState} from 'react';
import {IButtonProps} from 'src/ui/form/Button/Button';
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
     * Свойства для логотипа.
     */
    logo?: {
        /**
         * Заголовок логотипа.
         */
        title: string,

        /**
         * Дополнительные свойства ссылки логотипа.
         */
        linkProps?: ILinkProps,

        /**
         * Иконка логотипа в виде строки или компонента React.
         */
        icon?: string | React.ReactElement,

        /**
         * Дополнительные классы стилей для логотипа.
         */
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

    /**
     * Параметры авторизации.
     */
    authParams?: {
        /**
         * Флаг для отображения кнопки авторизации
         */
        isAuth: boolean,

        /**
         * Маршрут, на который перенаправлять пользователя для авторизации.
         */
        toRoute?: string,

        /**
         * Свойства для модального окна авторизации.
         */
        modal?: IModalProps,

        /**
        * Параметры для кнопки авторизации
        */
        buttonProps?: IButtonProps,
    },

    /**
     * Информация о пользователе.
     */
    user?: {
        /**
         * Имя пользователя.
         */
        name?: string,

    /**
     * Свойства для аватара пользователя.
     */
        avatar?: IAvatarProps,

        /**
         * Свойства для меню пользователя.
         */
        menu?: IMenuProps,
    }

    /**
     * Свойства для бургер-меню.
     */
    burgerMenu?: {
        /**
         * Контент бургер-меню в виде компонента React.
         */
        content?: React.ReactElement,

        /**
         * Свойства для ссылок бургер-меню.
         */
        links?: ILinkProps,
    }

    [key: string]: any;
}

export interface IHeaderViewProps extends IHeaderProps {
    toggleBurger: VoidFunction,
    isBurgerOpened: boolean,
}

function Header(props: IHeaderProps): JSX.Element {
    const [isBurgerOpened, setIsBurgerOpened] = useState(false);

    const toggleBurger = useCallback(() => {
        setIsBurgerOpened(prev => !prev);
    }, []);

    return useComponents().ui.renderView(props.view || 'layout.HeaderView', {
        ...props,
        toggleBurger,
        isBurgerOpened,
    });
}

Header.defaultProps = {
    size: 'md',
};

export default Header;
