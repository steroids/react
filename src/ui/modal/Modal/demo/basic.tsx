import * as React from 'react';

import useDispatch from '../../../../hooks/useDispatch';
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
            title='Hello!'
            isClosing={props.isClosing}
            onClose={props.onClose}
            controls={[{label: __(('OK')), onClick: () => props.onClose()}]}
        >
            <div className='mb-3'>
                This is your modal window.
            </div>
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

/**
 * Basic
 * @order 1
 * @col 6
 */
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
