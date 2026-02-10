import React, {ComponentProps, useEffect, useMemo} from 'react';
import {IButtonProps} from '../../form/Button/Button';
import {useComponents} from '../../../hooks';

/**
 * Modal
 * Модальное окно
 */
export interface IModalProps {
    /**
     * Кастомный CSS-класс
     * @example 'CustomCssClassName'
     */
    className?: CssClassName,

    /**
     * Компонент, который отрендерится внутри Modal
     * @example () => <InnerModalComponent />
     */
    component?: (props: ComponentProps<any>) => JSX.Element,

    /**
     * Свойства для внутреннего компонента
     */
    componentProps?: any,

    /**
     * Коллекция кнопок, которая отобразится в нижней секции Modal
     * @example
     * [
     *  {
     *   label: __(('Закрыть')),
     *   onClick: () => props.onClose()
     *  }
     * ]
     */
    buttons?: IButtonProps[],

    /**
     * Время, в течение которого будет происходить анимация закрытия Modal.
     * Переопределяет отрезок времени, заданный в ModalPortal
     * @example 300
     */
    closeTimeoutMs?: number,

    /**
     * Время в миллисекундах, через которое автоматически произойдет закрытие Modal.
     * @example 1000
     */
    closeAfterMs?: number,

    /**
     * Группа Modal
     * @example 'modal'
     */
    group?: string,

    /**
     * Порядковый номер Modal
     * @example 0
     */
    index?: number,

    /**
     * Значение свойства отслеживается для показа/закрытия Modal.
     * Если для компонента ModalPortal установлено значение задержки (animationDelayMc), то после закрытия
     * пользователем Modal, оно исчезнет не сразу, а через указанный в animationDelayMc промежуток времени.
     * В течение этого времени флаг isClosing будет равен true.
     * Если задержка не установлена, Modal закроется сразу же и флаг isClosing всегда будет равен false.
     * @example true
     */
    isClosing?: boolean,

    /**
     * Обработчик срабатывает при закрытии Modal
     * @param args
     */
    onClose?: (...args: any[]) => void,

    /**
     * Размер Modal
     * @example 'middle'
     */
    size?: Size,

    /**
     * Заголовок Modal
     * @example 'Заявка отправлена на модерацию'
     */
    title?: string,

    /**
     * Закрытие Modal при нажатии на клавишу 'ESC'
     * @example true
     */
    shouldCloseOnEsc?: boolean,

    /**
     * Закрытие Modal при клике на компонент overlay внутри Modal (темный фон, отделяющий контент страницы от Modal)
     * @example true
     */
    shouldCloseOnOverlayClick?: boolean,

    /**
     * Переопределение React-компонента для кастомизации view-отображения
     * @example MyCustomView
     */
    view?: CustomView,

    /**
     * Свойства для view компонента
     */
    viewProps?: CustomViewProps,

    /**
     * Вложенные элементы
     */
    children?: string | any,

    [key: string]: any,
}

export type IModalViewProps = IModalProps;

function Modal(props: IModalProps): JSX.Element {
    const components = useComponents();

    const ModalView = props.view || components.ui.getView('modal.ModalView');
    const ContentComponent = props.component;

    useEffect(() => {
        if (props.closeAfterMs) {
            setTimeout(() => props.onClose(), props.closeAfterMs);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const viewProps = useMemo(() => ({
        size: props.size,
        className: props.className,
        closeTimeoutMs: props.closeTimeoutMs,
        isClosing: props.isClosing,
        onClose: props.onClose,
        shouldCloseOnEsc: props.shouldCloseOnEsc,
        shouldCloseOnOverlayClick: props.shouldCloseOnOverlayClick,
        title: props.title,
        children: props.children,
        buttons: props.buttons,
        viewProps: props.viewProps,
        // eslint-disable-next-line max-len
    }), [props.buttons, props.children, props.className, props.closeTimeoutMs, props.isClosing, props.onClose, props.shouldCloseOnEsc, props.shouldCloseOnOverlayClick, props.size, props.title, props.viewProps]);

    return (
        <ModalView {...viewProps}>
            {(ContentComponent && (
                <ContentComponent
                    {...props}
                    {...props.componentProps}
                />
            )) || (
                props.children
            )}
        </ModalView>
    );
}

Modal.defaultProps = {
    size: 'md',
    shouldCloseOnEsc: true,
    shouldCloseOnOverlayClick: true,
};

export default Modal;
