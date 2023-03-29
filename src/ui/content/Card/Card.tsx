import {IButtonProps} from 'src/ui/form/Button/Button';
import {ILinkProps} from 'src/ui/nav/Link/Link';
import {useComponents} from '../../../hooks';
import {IAvatarProps} from '../Avatar/Avatar';

export interface ICardProps {
    /**
     * Дополнительный CSS-класс
     */
    className?: CssClassName,

    /**
     * Дочерние элементы
     */
    children?: CustomView,

    /**
     * Обложка для карточки, нужно передать ссылку на изображение
     * @example 'https://cat/cat.png'
     */
    cover?: string,

    /**
     * Описание карточки
     * @example {'Scroll to see more...'}
     */
    description?: string,

    /**
     * Контент хедера
     */
    header?: {
        avatar?: IAvatarProps,
        menu?: boolean,
        head?: string,
        subhead?: string,
    },

    /**
     * Контент футера
     */
    footer?: {
        head: string,
        subhead: string,
    },

    /**
    * Коллекция ссылок
    * @example {}
    */
    links?: ILinkProps[],

    /**
     * Коллекция кнопок
     */
    buttons: IButtonProps[],

    /**
     * Объект CSS стилей
     * @example {width: '30px'}
     */
    style?: CustomStyle,

    /**
     * Заголовок карточки
     * @example {'Main card'}
     */
    title?: string,

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;
}

export type ICardViewProps = ICardProps

function Card(props: ICardProps) {
    const components = useComponents();
    return components.ui.renderView(props.view || 'content.CardView', {
        ...props,
    });
}

export default Card;
