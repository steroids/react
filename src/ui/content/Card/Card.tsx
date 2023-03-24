import {useComponents} from '../../../hooks';

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
     * Текст для header
     */
    header?: string,

    /**
     * Текст для footer
     */
    footer?: string,

    /**
     * Ориентация карточки, горизонтальная и вертикальная
     * @example {'vertical-reverse'}
     */
    orientation?: 'vertical' | 'vertical-reverse' | 'horizontal' | string,

    /**
     * Ориентация карточки, горизонтальная и вертикальная
     * @example {'vertical-reverse'}
     */
    shape?: 'square' | 'circle',

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

Card.defaultProps = {
    borderColor: 'default',
    orientation: 'vertical',
    shape: 'circle',
};

export default Card;
