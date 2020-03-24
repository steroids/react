import * as React from 'react';

import Button from '../../../form/Button';
import ModalPortal from '../../ModalPortal';
import {openModal} from '../../../../actions/modal';
import {connect} from '../../../../hoc';
import {IConnectHocOutput} from '../../../../hoc/connect';
import Modal from '../Modal';

interface IMyModalProps {
    text?: string,
}

class MyModal extends React.Component<IMyModalProps> {
    render() {
        return (
            <Modal title='My Modal'>
                {this.props.text}
            </Modal>
        );
    }
}

@connect()
export default class ModalDemo extends React.PureComponent<IConnectHocOutput> {

    render() {
        return (
            <>
                <ModalPortal/>
                <Button
                    label='Open modal'
                    onClick={() => this.props.dispatch(
                        openModal(
                            MyModal,
                            {text: 'demo text'} as IMyModalProps
                        )
                    )}
                />
            </>
        );
    }

}
