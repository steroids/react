import * as React from 'react';

import useDispatch from '@steroidsjs/core/hooks/useDispatch';
import Button from '../../../form/Button';
import ModalPortal from '../../ModalPortal';
import {openModal} from '../../../../actions/modal';
import Modal from '../Modal';

interface IMyModalProps {
    nextId: number,
    isClosing: boolean;
    onClose: (...args: any[]) => any;
}

// TODO test sub modals

function MyModal(props: IMyModalProps) {
    const dispatch = useDispatch();
    return (
        <Modal
            title='Open modal'
            isClosing={props.isClosing}
            onClose={props.onClose}
        >
            Demo text
            {' '}
            {props.nextId}
            <Button
                label='Open sub modal'
                onClick={e => {
                    e.preventDefault();
                    dispatch(openModal(MyModal, {
                        modalId: 'test' + props.nextId,
                        nextId: props.nextId + 1,
                    }));
                }}
            />
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
                onClick={e => {
                    e.preventDefault();
                    dispatch(openModal(MyModal, {
                        modalId: 'test0',
                        nextId: 1,
                    }));
                }}
            />
        </>
    );
};
