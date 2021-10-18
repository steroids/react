import * as React from 'react';
import _orderBy from 'lodash-es/orderBy';
import {useCallback} from 'react';
import {useSelector} from '../../../hooks';
import useDispatch from '../../../hooks/useDispatch';
import {closeModal, modalMarkClosing} from '../../../actions/modal';
import {getOpened, MODAL_DEFAULT_GROUP} from '../../../reducers/modal';
import {IModalProps} from '../Modal/Modal';

export interface IModalPortalProps {
    /**
     * Время, через которое произойдет закрытие Modal
     * @example 300
     */
    animationDelayMc?: number,

    /**
     * Группа Modal
     * @example 'modal'
     */
    group?: string,
}

function ModalPortal(props: IModalPortalProps): JSX.Element {
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
        const animationDelayMc = item.props?.closeTimeoutMs ?? props.animationDelayMc;
        if (animationDelayMc > 0) {
            dispatch(modalMarkClosing(item.id, props.group));
            setTimeout(() => closeInternal(item), animationDelayMc);
        } else {
            closeInternal(item);
        }
    }, [closeInternal, dispatch, props.animationDelayMc, props.group]);

    return _orderBy(opened, 'id').map((item, index) => {
        const ModalComponent = item.modal;
        const modalProps = {
            ...item.props,
            index,
            group,
            isClosing: item.isClosing,
            onClose: () => onClose(item),
            closeTimeoutMs: item.props.closeTimeoutMs || props.animationDelayMc,
        } as IModalProps;

        return (
            <ModalComponent
                key={item.id}
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
