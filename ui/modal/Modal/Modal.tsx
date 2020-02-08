import * as React from 'react';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IModalProps {
    onClose?: (...args: any[]) => any;
    view?: any;
}

export interface IModalViewProps {
    onClose?: (...args: any[]) => any;
}

interface IModalPrivateProps extends IComponentsHocOutput {

}

@components('ui')
export default class Modal extends React.PureComponent<IModalProps & IModalPrivateProps> {
    render() {
        const ModalView = this.props.view || this.props.ui.getView('modal.ModalView');
        return (
            <ModalView {...this.props} onClose={this.props.onClose}>
                {this.props.children}
            </ModalView>
        );
    }
}
