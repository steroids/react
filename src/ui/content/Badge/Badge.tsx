import React, {useCallback, useState} from 'react';
import {useComponents} from '../../../hooks';

interface ICounter {
    isEnable: boolean,
    content: string | number
}

export interface IBadgeProps {
    /**
    * Дополнительный CSS-класс
    */
    className?: CssClassName;

    /**
     * Тип badge
     */
    type: ColorName;

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
     * Нужно ли отображать счетчик
     */
    counter: boolean | ICounter;

    style?: React.CSSProperties,

    /**
     * Размер для badge
     */
    size: Size;
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
    size: 'md',
    counter: false,
    showClose: false,
};

export default Badge;
