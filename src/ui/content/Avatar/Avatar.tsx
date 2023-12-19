import {useState, useCallback, useMemo} from 'react';
import {useComponents} from '../../../hooks';

/**
 * Avatar
 *
 * Компонент аватара, который отображает изображение пользователя или иконку.
 * Он может использоваться для представления пользователя, контакта или профиля.
 *
 * Компонент `Avatar` позволяет указать размер, форму, изображение или иконку,
 * а также добавить альтернативный текст и статус онлайна.
 *
 * Если изображение аватара не загружается, можно показать альтернативный текст
 * или иконку вместо него.
 */
export interface IAvatarProps extends IUiComponent {

    /**
     * Альтернативный текст для изображения
     * @example 'default image'
     */
    alt?: string,

    /**
     * Дочерние элементы
     */
    children?: React.ReactNode,

    /**
     * Размер аватара
     * @example 'md'
     */
    size?: Size | number,

    /**
     * Форма аватара
     * @example 'circle'
     */
    shape?: 'circle' | 'square' | string,

    /**
     * Ссылка на изображение для аватара
     * @example 'https://user/avatar.png'
     */
    src?: string,

    // TODO Список адаптивных разрешений изображения
    /**
    * Набор адаптивных изображений
    */
    srcSet?: string,

    /**
     * Статус онлайна
     * @example true
     */
    status?: boolean,

    /**
     * Заголовок аватарки
     * @example 'Avatar'
     */
    title?: string,

    /**
     * Наличие обводки вокруг аватара
     * @example true
     */
    hasBorder?: boolean,
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
        let resultTitle = '';
        if (props.title) {
            const title = props.title.split(' ');
            resultTitle = title[0][0].toUpperCase();
            if (title.length > 1) {
                resultTitle += title[1][0].toUpperCase();
            }
        }
        return resultTitle;
    }, [props.title]);

    const viewProps = useMemo(() => ({
        alt: props.alt,
        size: props.size,
        shape: props.shape,
        src: props.src,
        srcSet: props.srcSet,
        status: props.status,
        title: props.title,
        children: props.children,
        hasBorder: props.hasBorder,
        className: props.className,
        style: props.style,
        isError,
        onError,
        formattedTitle,
    }), [props.alt, props.size, props.shape, props.src, props.srcSet, props.status, props.title,
        props.children, props.hasBorder, props.className, props.style, isError, onError, formattedTitle]);

    return components.ui.renderView(props.view || 'content.AvatarView', viewProps);
}

Avatar.defaultProps = {
    size: 'md',
    shape: 'circle',
    status: false,
};

export default Avatar;
