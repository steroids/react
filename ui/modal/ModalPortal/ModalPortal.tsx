import * as React from 'react';
import _orderBy from 'lodash-es/orderBy';
import {useSelector} from '@steroidsjs/core/hooks';
import useDispatch from '@steroidsjs/core/hooks/useDispatch';
import {useCallback} from 'react';
import {closeModal, modalMarkClosing} from '../../../actions/modal';
import {getOpened, MODAL_DEFAULT_GROUP} from '../../../reducers/modal';
import {IModalProps} from '../Modal/Modal';

export interface IModalPortalProps {
    animationDelayMc?: number,
    group?: string,
}

function ModalPortal(props: IModalPortalProps) {
    const dispatch = useDispatch();

    const group = props.group || ModalPortal.defaultProps.group;
    const opened = useSelector(state => getOpened(state, group));

    const closeInternal = useCallback((item) => {
        if (item.props && item.props.onClose) {
            item.props.onClose();
        }
        dispatch(closeModal(item.id, props.group));
    }, [dispatch, props.group]);

    const onClose = useCallback((item) => {
        if (props.animationDelayMc || props.animationDelayMc === 0) {
            dispatch(modalMarkClosing(item.id, props.group));
            setTimeout(() => closeInternal(item), props.animationDelayMc);
        } else {
            closeInternal(item);
        }
    }, [closeInternal, dispatch, props.animationDelayMc, props.group]);

    return _orderBy(opened, 'id').map((item, index) => {
        const ModalComponent = item.modal;
        const modalProps = {
            index,
            group,
            isClosing: item.isClosing,
            onClose: () => onClose(item),
        } as IModalProps;

        return (
            <ModalComponent
                key={item.id}
                {...item.props}
                {...modalProps}
            />
        );
    });
}

ModalPortal.defaultProps = {
    group: MODAL_DEFAULT_GROUP,
    animationDelayMc: 300,
};

export default ModalPortal;
