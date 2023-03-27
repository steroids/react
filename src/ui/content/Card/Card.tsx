import {IButtonProps} from 'src/ui/form/Button/Button';
import {useComponents} from '../../../hooks';
import {IAvatarProps} from '../Avatar/Avatar';

interface ILink {
    /**
    * URL адрес куда ведет ссылка с
    * @example {'https://steroids.kozhin.dev'}
    */
    url: string,

    /**
    * Отображаемый текст ссылки
    * @example {'Click me!'}
    */
    text: string,

    /**
     * Отображаемый текст при наведении на ссылку
     * @example {'Steroids for React'}
     */
    title: string,

    target: string,
}

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
    links: ILink[],

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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICardViewProps extends ICardProps {

}

function Card(props: ICardProps) {
    const components = useComponents();
    return components.ui.renderView(props.view || 'content.CardView', {
        ...props,
    });
}

export default Card;
