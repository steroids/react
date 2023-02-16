import * as React from 'react';
import Modal, {IModalProps} from '../Modal';
import Button from '../../../form/Button';
import {openModal} from '../../../../actions/modal';
import useDispatch from '../../../../hooks/useDispatch';

function DemoModal(props: IModalProps) {
    return (
        <Modal
            title='Custom closing time'
            onClose={props.onClose}
            {...props}
        >
            <div style={{marginBottom: '20px'}}>
                This is your modal content.
            </div>
        </Modal>
    );
}

/**
 * Настройка времени, через которое произойдет закрытие Modal.
 * @order 5
 * @col 6
 */
export default () => {
    const dispatch = useDispatch();
    return (
        <>
            <Button
                label='Open modal'
                onClick={e => {
                    e.preventDefault();
                    dispatch(openModal(DemoModal, {
                        modalId: 'demo',
                        closeTimeoutMs: 1000,
                    }));
                }}
            />
        </>
    );
};
