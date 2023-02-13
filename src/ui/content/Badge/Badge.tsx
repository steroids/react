import React, {useCallback, useState} from 'react';
import {useComponents} from 'src/hooks';

export interface IBadgeProps {
    /**
    * Дополнительный CSS-класс
    */
    className?: CssClassName;

    /**
     * Дочерние элементы
     */
    children?: CustomView;

    /**
     * Тип badge
     */
    type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

    /**
     * Стиль скругления
     */
    borderType: 'rounder' | 'squarer';

    /**
     * Переопределение view React компонента для кастомизации отображения
     */
    view?: CustomView;

    /**
     * Нужно ли отображать кнопку, чтобы закрыть badge
     */
    showClose?: boolean;

    /**
     * Callback функция вызываемая при нажатии на кнопку закрытия
     * @example {() => console.log('this is callback')}
     */
    onClose?: () => void,

    /**
     * Время анимации в миллисекундах
     * @example {1000}
     */
    animationDuration?: number,

    /** Текст для badge
    * @example {'Sending is confirmed!'}
    */
    message?: string,

    /**
     * Нужно ли отображать ставку в badge
     */
    hasChip?: boolean;

    /**
    * Содержимое вставки
    */
    chipContent?: string;

    style?: React.CSSProperties,
}

export interface IBadgeViewProps extends IBadgeProps {
    isVisible: boolean,
    isExist: boolean,
    onClose: () => void
}

function Badge(props: IBadgeProps): JSX.Element {
    const components = useComponents();

    const [isExist, setIsExist] = useState<boolean>(true);
    const [isVisible, setIsVisible] = useState<boolean>(true);

    const onClose = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => setIsExist(false), props.animationDuration);
        if (props.onClose) {
            props.onClose();
        }
    }, [props]);

    return components.ui.renderView(props.view || 'content.BadgeView', {
        ...props,
        isExist,
        isVisible,
        onClose,
    });
}

Badge.defaultProps = {
    type: 'primary',
    borderType: 'squarer',
    showClose: false,
    animation: false,
    animationDuration: 390,
};

export default Badge;
