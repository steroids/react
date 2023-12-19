import React, {useCallback, useState} from 'react';
import {useComponents} from '../../../hooks';

export interface ICounter {
    /**
    * Состояние счетчика
    * @example true
    */
    isEnable: boolean,

    /**
    * Содержимое счетчика
    * @example 'Counter'
    */
    content: string | number,
}

/**
 * Badge
 *
 * Компонент бэйджа, который используется для отображения информационных меток на элементах пользовательского интерфейса.
 * Он может использоваться для обозначения статуса, количества, типа или любой другой важной информации.
 *
 * Компонент `Badge` позволяет указать тип бэйджа, стиль скругления, наличие кнопки для закрытия,
 * текст сообщения, отображение счетчика и размер.
 *
 * Если установлен флаг `showClose`, то пользователь может закрыть бэйдж, вызывая соответствующую callback функцию `onClose`.
 */
export interface IBadgeProps extends IUiComponent {
    /**
     * Тип badge
     * @example 'primary'
     */
    type: ColorName,

    /**
     * Стиль скругления
     */
    roundingStyle: 'rounder' | 'squarer',

    /**
     * Нужно ли отображать кнопку, чтобы закрыть badge
     */
    showClose?: boolean,

    /**
     * Callback функция вызываемая при нажатии на кнопку закрытия
     * @example () => console.log('Hello from onClose!')
     */
    onClose?: () => void,

    /** Текст для badge
    * @example 'Sending is confirmed!'
    */
    message?: string,

    /**
     * Нужно ли отображать счетчик
     * @example
     * {
     *  isEnable: true,
     *  content: 'Hello from counter!',
     * }
     */
    counter: boolean | ICounter,

    /**
     * Размер для badge
     * @example 'md'
     */
    size: Size,
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
