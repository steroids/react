import * as React from 'react';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IModalProps {
    index?: number,
    onClose?: (...args: any[]) => any;
    title?: string,
    view?: any;
    className?: string;
    isClosing?: boolean;
    group?: string;
}

export interface IModalViewProps extends IModalProps {
    isClosing?: boolean,
}

interface IModalPrivateProps extends IComponentsHocOutput {

}

@components('ui')
export default class Modal extends React.PureComponent<IModalProps & IModalPrivateProps> {

    render() {
        const ModalView = this.props.view || this.props.ui.getView('modal.ModalView');
        return (
            <ModalView {...this.props}>
                {this.props.children}
            </ModalView>
        );
    }

}
