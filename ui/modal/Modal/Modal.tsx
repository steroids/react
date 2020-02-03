import * as React from 'react';
import {components} from '../../../hoc';

interface IModalProps {
    onClose?: (...args: any[]) => any;
    view?: any;
    getView?: any;
    ui?: any;
}

@components('ui')
export default class Modal extends React.PureComponent<IModalProps, {}> {
    render() {
        const ModalView =
            this.props.view || this.props.ui.getView('modal.ModalView');
        return (
            <ModalView {...this.props} onClose={this.props.onClose}>
                {this.props.children}
            </ModalView>
        );
    }
}
