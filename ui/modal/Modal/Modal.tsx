import * as React from 'react';
import {useComponents} from '@steroidsjs/core/hooks';
import {IControlItem} from '../../nav/Controls/Controls';

export interface IModalProps {
    index?: number,
    onClose?: (...args: any[]) => any;
    title?: string,
    size?: Size,
    view?: any;
    className?: CssClassName;
    isClosing?: boolean;
    group?: string;
    component?: any;
    componentProps?: any;
    controls?: IControlItem[],
    [key: string]: any,
}

export interface IModalViewProps extends IModalProps {
    isClosing?: boolean,
}

function Modal(props: IModalProps) {
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
