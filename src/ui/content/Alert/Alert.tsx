import React, {useState, useCallback, useMemo} from 'react';
import {useComponents} from '../../../hooks';

/**
 * Alert
 *
 * Компонент оповещения, который отображает сообщения для пользователя.
 * Он может быть использован для показа уведомлений, предупреждений или ошибок,
 * которые требуют внимания пользователя.
 *
 * Компонент `Alert` может содержать текстовое сообщение и дополнительное описание,
 * а также опциональную кнопку для закрытия оповещения.
 *
 * Оповещения могут иметь различные типы, такие как 'success', 'info', 'warning', 'error'
 * или другие пользовательские типы.
 *
 * Компонент также предлагает настройки для отображения иконки, анимации, а также
 * обратного вызова при закрытии оповещения.
 */
export interface IAlertProps extends IUiComponent {
    /**
    * Дочерние элементы
    * @example { <span>children</span> }
    */
    children?: React.ReactNode,

    /**
     * Типы Оповещений
     * @example 'info'
     */
    type?: AlertColorName,

    /** Основное сообщения Оповещения
     * @example 'Sending is confirmed!'
     */
    message?: string,

    /** Дополнительное содержание сообщения.
     * @example 'Please, check your email.'
     */
    description?: string,

    /**
     * Нужно ли отображать кнопку, чтобы закрыть Оповещение
     */
    showClose?: boolean,

    /**
     * Нужно ли отображать иконку, соответствующую типа Оповещения
     * @example true
     */
    showIcon?: boolean,

    /**
     * Callback функция вызываемая при нажатии на кнопку закрытия
     * @example
     * {
     *  () => console.log('this is callback')
     * }
     */
    onClose?: () => void,

    /**
    * Флаг, который включает анимацию
    * @example true
    */
    animation?: boolean,

    /**
     * Время анимации в миллисекундах
     * @example 1000
     */
    animationDuration?: number,

    [key: string]: any,
}

export interface IAlertViewProps extends IAlertProps {
    isExist: boolean,
    isVisible: boolean,
    onClose: () => void,
    onClick?: (e: MouseEvent) => void,
}

function Alert(props: IAlertProps): JSX.Element {
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

    const viewProps = useMemo(() => ({
        type: props.type,
        showIcon: props.showIcon,
        message: props.message,
        description: props.description,
        showClose: props.showClose,
        className: props.className,
        style: props.style,
        isExist,
        isVisible,
        onClose,
    }), [isExist, isVisible, onClose, props.className, props.description, props.message, props.showClose, props.showIcon, props.style, props.type]);

    return components.ui.renderView(props.view || 'content.AlertView', viewProps);
}

Alert.defaultProps = {
    type: 'default',
    showClose: false,
    showIcon: true,
    animation: false,
    animationDuration: 390,
};

export default Alert;
