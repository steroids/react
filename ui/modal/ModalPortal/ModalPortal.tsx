import * as React from 'react';
import {useSelector} from '@steroidsjs/core/hooks';
import useDispatch from '@steroidsjs/core/hooks/useDispatch';
import {closeModal, modalMarkClosing} from '../../../actions/modal';
import {getOpened, MODAL_DEFAULT_GROUP} from '../../../reducers/modal';
import {IModalProps} from '../Modal/Modal';

export interface IModalPortalProps {
    animationDelayMc?: number,
    group?: string,
}

interface IOpenedModal {
    modal?: any,
    props?: any,
}

function ModalPortal(props: IModalPortalProps) {
    const dispatch = useDispatch();

    // TODO add types for opened
    const {opened} = useSelector(state => ({
        opened: getOpened(state, props.group || ModalPortal.defaultProps.group),
    }));

    const closeInternal = (item) => {
        if (item.props && item.props.onClose) {
            item.props.onClose();
        }
        dispatch(closeModal(item.id, props.group));
    };

    const onClose = (item) => {
        if (props.animationDelayMc || props.animationDelayMc === 0) {
            dispatch(modalMarkClosing(item.id, props.group));
            setTimeout(() => closeInternal(item), props.animationDelayMc);
        } else {
            closeInternal(item);
        }
    };

    return (opened || []).map((item, index) => {
        const ModalComponent = item.modal;
        const modalProps = {
            index,
            group: item.group,
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
