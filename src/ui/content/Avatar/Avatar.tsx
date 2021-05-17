import React from 'react';
import { useComponents } from '@steroidsjs/core/hooks';

type AvatarSizes = 'large' | 'medium' | 'small';

interface IAvatarProps {
    /**
     * Альтернативный текст для изображения
     * @example {'default image'}
     * @returns {string}
     */
    alt?: string,

    /**
     * Дополнительный CSS-класс
     */
    className?: CssClassName;

    /**
     * Дочерние элементы
     */
    children?: React.ReactNode,

    //TODO - Adaptive sizes { xs: number, sm: number, ...}
    /**
     * Размер аватара
     * @example {'medium'}
     * @returns {AvatarSizes | number}
     */
    size?: AvatarSizes | number,

    /**
     * Форма аватара
     * @example {'circle'}
     * @returns {'circle' | 'square' | string}
     */
    shape?: 'circle' | 'square' | string,

    /**
     * Ссылка на изображение для аватара
     * @example {'https://user/avatar.png'}
     * @returns {string}
     */
    src?: string,

    // TODO Список адаптивных разрешений изображения
    srcSet?: string;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;

    /**
     * Объект CSS стилей
     * @example {width: '30px'}
     */
    style?: React.CSSProperties,
}

export type IAvatarViewProps = IAvatarProps

function Avatar(props: IAvatarProps) {
    const components = useComponents();
    return components.ui.renderView(props.view || 'content.AvatarView', {
        ...props,
    });
}

Avatar.defaultProps = {
    size: 'medium',
    shape: 'circle',
};

export default Avatar;
