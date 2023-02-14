import React, {useCallback, useState} from 'react';
import {useComponents} from '../../../hooks';

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
    roundingStyle: 'rounder' | 'squarer';

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
    isExist: boolean,
}
function Badge(props: IBadgeProps): JSX.Element {
    const components = useComponents();

    const [isExist, setIsExist] = useState(true);

    const onClose = useCallback(() => {
        setIsExist(false);
        if (props.onClose) {
            props.onClose();
        }
    }, [props]);

    return components.ui.renderView(props.view || 'content.BadgeView', {
        ...props,
        isExist,
        onClose,
    });
}

Badge.defaultProps = {
    type: 'primary',
    roundingStyle: 'squarer',
    showClose: false,
};

export default Badge;
