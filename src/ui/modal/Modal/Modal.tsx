import * as React from 'react';
import {useComponents} from '../../../hooks';
import {IControlItem} from '../../nav/Controls/Controls';

/**
 * Modal
 * Модальное окно
 */
export interface IModalProps {
    /**
     * Порядковый номер модального окна
     * @example 0
     */
    index?: number,

    /**
     * Обработчик для закрытия модального окна
     * @param args
     */
    onClose?: (...args: any[]) => any;

    /**
     * Заголовок модального окна
     * @example 'Заявка отправлена на модерацию'
     */
    title?: string,

    /**
     * Размер
     */
    size?: Size,

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: any;

    /**
     * CSS-класс для элемента отображения
     */
    className?: CssClassName;

    /**
     * Если для компонента ModalPortal установлено значение задержки (animationDelayMc), то после закрытия
     * пользователем модального окна, оно исчезнет не сразу, а через указанный в animationDelayMc промежуток времени.
     * В течение этого времени флаг isClosing будет равен true.
     * Если задержка не установлена, модальное окно закроется сразу же и флаг isClosing всегда будет равен false.
     * @example true
     */
    isClosing?: boolean;

    /**
     * Группа модального окна
     * @example 'modal'
     */
    group?: string;

    /**
     * Компонент, который отрендерится внутри модального окна
     * @example InnerModalComponent
     */
    component?: any;

    /**
     * Свойства для внутреннего компонента
     */
    componentProps?: any;

    /**
     * Коллекция контролов, которая отобразится в модальном окне
     * @example [{label: __(('Отлично')), onClick: () => props.onClose()}]
     */
    controls?: IControlItem[],

    [key: string]: any,
}

export interface IModalViewProps extends IModalProps {
    isClosing?: boolean,
}

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
    size: 'md',
};

export default Modal;
