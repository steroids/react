import * as React from 'react';
import {useComponents} from '../../../hooks';
import {IControlItem} from '../../nav/Controls/Controls';

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
    component?: () => JSX.Element,

    /**
     * Свойства для внутреннего компонента
     */
    componentProps?: any,

    /**
     * Коллекция контролов, которая отобразится в Modal
     * @example [{label: __(('Закрыть')), onClick: () => props.onClose()}]
     */
    controls?: IControlItem[],

    /**
     * Время, через которое произойдет закрытие Modal.
     * В этот отрезок времени должны происходить все анимации закрытия компонента.
     * Переопределяет отрезок времени, заданный в ModalPortal
     * @example 300
     */
    closeTimeoutMs?: number,

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

    [key: string]: any,
}

export type IModalViewProps = IModalProps;

function Modal(props: IModalProps): JSX.Element {
    const components = useComponents();

    const ModalView = props.view || components.ui.getView('modal.ModalView');
    const ContentComponent = props.component;

    return (
        <ModalView {...props}>
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
    size: 'middle',
    shouldCloseOnEsc: true,
    shouldCloseOnOverlayClick: true,
};

export default Modal;
