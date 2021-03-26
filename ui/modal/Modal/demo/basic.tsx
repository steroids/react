import * as React from 'react';

import useDispatch from '@steroidsjs/core/hooks/useDispatch';
import Button from '../../../form/Button';
import ModalPortal from '../../ModalPortal';
import {openModal} from '../../../../actions/modal';
import Modal from '../Modal';

interface IMyModalProps {
    isClosing: boolean;
    onClose: (...args: any[]) => any;
}

function MyModal(props: IMyModalProps) {
    return (
        <Modal
            title='Open modal'
            isClosing={props.isClosing}
            onClose={props.onClose}
        >
            Demo text
        </Modal>
    );
}

export default () => {
    const dispatch = useDispatch();
    return (
        <>
            <ModalPortal />
            <Button
                label='Open modal'
                onClick={() => dispatch(
                    openModal(MyModal),
                )}
            />
        </>
    );
};
