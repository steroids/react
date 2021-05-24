import React, {useState, useCallback, useMemo} from 'react';
import { useComponents } from '@steroidsjs/core/hooks';

type AvatarSizes = 'large' | 'medium' | 'small' | 'x_large';

interface IAvatarProps {
    /**
     * Заголовок аватарки
     * @example {'Avatar'}
     */
    title?: string,
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

    /**
     * Зеленый значёк онлайна
     * @example {true}
     */
    status?: boolean,

}

export interface IAvatarViewProps extends IAvatarProps {
    isError: boolean,
    onError: () => void,
    formattedTitle: () => void,
}

function Avatar(props: IAvatarProps) {

    const components = useComponents();

    const [isError, setIsError] = useState<boolean>(false);

    const onError = useCallback(() => {
        if (!isError) {
            setIsError(true);
        }
    }, [isError]);

    const formattedTitle = useMemo(() => {
        let resultTitle;
        const title = props.title.split(' ');
        resultTitle = title[0][0].toUpperCase();
        if (title.length > 1) {
            resultTitle += title[1][0].toUpperCase();
        }
        return resultTitle;
    }, [props.title]);

    return components.ui.renderView(props.view || 'content.AvatarView', {
        ...props,
        isError,
        formattedTitle,
        onError,
    });
}

Avatar.defaultProps = {
    size: 'medium',
    shape: 'circle',
    status: false,
    title: 'Title',
};

export default Avatar;
