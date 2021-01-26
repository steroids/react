import * as React from 'react';
import {closeModal, modalMarkClosing} from '../../../actions/modal';
import {getOpened, MODAL_DEFAULT_GROUP} from '../../../reducers/modal';
import connect, {IConnectHocOutput} from '../../../hoc/connect';
import {IModalProps} from '../Modal/Modal';

export interface IModalPortalProps {
    animationDelayMc?: number,
    group?: string,
}

interface IModalPortalPrivateProps extends IConnectHocOutput {
    opened?: {
        modal?: any,
        props?: any,
    }[];
}

const defaultProps = {
    group: MODAL_DEFAULT_GROUP,
    animationDelayMc: 300,
};

@connect(
    (state, props) => ({
        opened: getOpened(state, props.group || defaultProps.group),
    })
)
export default class ModalPortal extends React.PureComponent<IModalPortalProps & IModalPortalPrivateProps> {

    static defaultProps = defaultProps;

    render() {
        return (
            <>
                {(this.props.opened || []).map((item, index) => this.renderModal(item, index))}
            </>
        );
    }

    renderModal(item, index) {
        const ModalComponent = item.modal;
        const props = {
            index,
            group: item.group,
            isClosing: item.isClosing,
            onClose: () => this._onClose(item),
        } as IModalProps;

        return (
            <ModalComponent
                key={item.id}
                {...item.props}
                {...props}
            />
        );
    }

    _onClose(item) {
        if (this.props.animationDelayMc || this.props.animationDelayMc === 0) {
            this.props.dispatch(modalMarkClosing(item.id, this.props.group));
            setTimeout(() => this._closeInternal(item), this.props.animationDelayMc);
        } else {
            this._closeInternal(item);
        }
    }

    _closeInternal(item) {
        if (item.props && item.props.onClose) {
            item.props.onClose();
        }
        this.props.dispatch(closeModal(item.id, this.props.group));
    }
}
