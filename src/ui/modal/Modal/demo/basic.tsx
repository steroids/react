import * as React from 'react';

import useDispatch from '../../../../hooks/useDispatch';
import Button from '../../../form/Button';
import ModalPortal from '../../ModalPortal';
import {openModal} from '../../../../actions/modal';
import Modal from '../Modal';

function DemoModal(props: any) {
    return (
        <Modal
            title='Title'
            onClose={props.onClose}
            controls={[{label: __(('Control')), onClick: () => props.onClose()}]}
        >
            <div className='mb-3'>
                This is your modal window.
            </div>
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
                    dispatch(openModal(DemoModal, {
                        modalId: 'demo',
                    }));
                }}
            />
        </>
    );
};
