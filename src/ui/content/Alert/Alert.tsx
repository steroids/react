import React, {useState, useCallback} from 'react';
import { useComponents } from '../../../hooks';

export interface IAlertProps {
    view?: any,
    className?: CssClassName,

    /**
    * Дочерние элементы
    */
    action?: React.ReactNode,

    /**
     * Типы Оповещений
     * @example {'info'}
     */
    type: 'success' | 'info' | 'warning' | 'error' | string,

    /** Основное сообщения Оповещения
     * @example {'Sending is confirmed!'}
     */
    message?: string,

    /** Дополнительное содрежание сообщения.
     * @example {'Please, check your email.'}
     */
    description?: string,

    style?: React.CSSProperties,

    /**
     *  Нужно ли отображать кнопку, чтобы закрыть Оповещение
     */
    showClose?: boolean,

    /**
     * Нужно ли отображать иконку, соответствующую типа Оповещения
     * @example {true}
     */
    showIcon?: boolean,

    /**
     * Callback функция вызываемая при нажатии на кнопку закрытия
     * @example {() => console.log('this is callback')}
     */
    onClose?: () => void,

    animation?: boolean,

    /**
     * Время анимации в миллисекундах
     * @example {1000}
     */
    animationDuration?: number,

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

    return components.ui.renderView(props.view || 'content.AlertView', {
        ...props,
        isExist,
        isVisible,
        onClose,
    });
}

Alert.defaultProps = {
    type: 'success',
    showClose: false,
    showIcon: true,
    animation: false,
    animationDuration: 390,
};

export default Alert;
