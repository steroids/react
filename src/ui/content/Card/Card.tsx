import {IButtonProps} from 'src/ui/form/Button/Button';
import {ILinkProps} from 'src/ui/nav/Link/Link';
import {useComponents} from '../../../hooks';
import {IAvatarProps} from '../Avatar/Avatar';

export interface ICardHeader {
    /**
    * Параметры для аватара
    * @example
    * {
    *   src: 'Kate.png',
    *   status: true,
    * }
    */
    avatar?: IAvatarProps,

    /**
    * Отображается ли меню
    * @example true
    */
    menu?: boolean,

    /**
    * Текст шапки (заголовок)
    * @example 'Steroids.js head'
    */
    head?: string,

    /**
    * Текст шапки (заголовок)
    * @example 'Steroids.js subhead'
    */
    subhead?: string,
}

export interface ICardProps extends IUiComponent {
    /**
     * Дочерние элементы
     */
    children?: React.ReactNode,

    /**
     * Обложка для карточки, нужно передать ссылку на изображение
     * @example 'https://cat/cat.png'
     */
    cover?: string,

    /**
     * Описание карточки
     * @example 'Scroll to see more...'
     */
    description?: string,

    /**
     * Контент хедера
     * @example
     * avatar: {
     * src: 'Kate.png',
     * status: true,
     * },
     * head: 'Header',
     * subhead: 'Subhead',
     * menu: true,
     */
    header?: ICardHeader,

    /**
     * Контент футера
     */
    footer?: {
        head: string,
        subhead: string,
    },

    /**
    * Коллекция ссылок
    */
    links?: ILinkProps[],

    /**
     * Коллекция кнопок
     */
    buttons?: IButtonProps[],

    /**
     * Заголовок карточки
     * @example 'Main card'
     */
    title?: string,
}

export type ICardViewProps = ICardProps

function Card(props: ICardProps) {
    const components = useComponents();
    return components.ui.renderView(props.view || 'content.CardView', {
        ...props,
    });
}

export default Card;
