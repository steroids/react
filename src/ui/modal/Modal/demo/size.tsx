import * as React from 'react';
import Modal, {IModalProps} from '../Modal';
import Button from '../../../form/Button';
import {openModal} from '../../../../actions/modal';
import useDispatch from '../../../../hooks/useDispatch';

const sizesArray: Size[] = ['small', 'middle', 'large'];

function DemoModal(props: IModalProps) {
    return (
        <Modal
            title={`${props.size} modal`}
            onClose={props.onClose}
            {...props}
        >
            <div style={{marginBottom: '20px'}}>
                This is your content for
                <strong>
                    {' '}
                    {props.size}
                    {' '}
                </strong>
                modal.
            </div>
        </Modal>
    );
}

/**
 * По-умолчанию, Modal имеет 3 заданных размера.
 * @order 3
 * @col 12
 */
export default () => {
    const dispatch = useDispatch();
    return (
        <div style={{display: 'flex'}}>
            {sizesArray.map((size) => (
                <Button
                    key={size}
                    label={`Open ${size} modal`}
                    onClick={e => {
                        e.preventDefault();
                        dispatch(openModal(DemoModal, {
                            modalId: 'demo',
                            size,
                        }));
                    }}
                    style={{marginRight: '20px'}}
                />
            ))}
        </div>
    );
};
