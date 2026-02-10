import * as React from 'react';
import {useCallback} from 'react';

import CrudContent, {ICrudContentProps} from './CrudContent';
import {CRUD_ACTION_INDEX} from '../../../ui/crud/Crud/utils';
import Modal from '../../modal/Modal';

export default function CrudModal(props: ICrudContentProps): JSX.Element {
    // Get current item
    const crudItem = props.items.find(item => item.actionName === props.action);

    // Close handler
    const onModalClose = useCallback(() => {
        props.goToAction.call(null, CRUD_ACTION_INDEX);
    }, [props.goToAction]);

    return (
        <Modal
            size='lg'
            title={crudItem.title || crudItem.label || null}
            onClose={onModalClose}
        >
            <CrudContent {...props} />
        </Modal>
    );
}
