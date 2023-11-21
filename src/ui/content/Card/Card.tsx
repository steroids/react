import {ILinkProps} from '../../nav/Link/Link';
import {IButtonProps} from '../../form/Button/Button';
import {useComponents} from '../../../hooks';
import {IAvatarProps} from '../Avatar/Avatar';
import {IMenuProps} from '../Menu/Menu';

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
    * Свойства для компонента <Menu/>
    */
    menu?: IMenuProps,

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

/**
 * Card
 *
 * Компонент карточки, который представляет контент в структурированном формате с заголовком, обложкой, описанием,
 * кнопками, ссылками и другими элементами.
 *
 * Компонент `Card` позволяет передать дочерние элементы, обложку, описание, заголовок, параметры заголовка,
 * футер, коллекцию ссылок и коллекцию кнопок.
 */
export interface ICardProps extends IUiComponent {
    /**
     * Коллекция кнопок
     */
    buttons?: IButtonProps[],

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
     * Контент футера
     */
    footer?: {
        head: string,
        subhead: string,
    },

    /**
     * Контент хедера
     * @example
     * avatar: {
     *  src: 'Kate.png',
     *  status: true,
     * },
     * head: 'Header',
     * subhead: 'Subhead',
     * menu: {
     *  dropDownProps: {
     *   position: 'bottom',
     *   closeMode: 'click-any',
     *  },
     *  items: [
     *   {
     *    label: 'Вырезать',
     *    icon: 'cut',
     *    onClick: voidFunction
     *   },
     *   {
     *    label: 'Копировать',
     *    icon: 'copy',
     *    hasBorder: true
     *    onClick: voidFunction
     *   },
     *  ],
     *  icon: 'menu_dots',
     * },
     */
    header?: ICardHeader,

    /**
     * Коллекция ссылок
     */
    links?: ILinkProps[],

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
