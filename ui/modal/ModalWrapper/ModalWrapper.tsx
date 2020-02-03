import * as React from 'react';
import {connect} from 'react-redux';
import {closeModal} from '../../../actions/modal';
import {getOpened} from '../../../reducers/modal';

interface IModalWrapperProps {
    opened?: {
        modal?: any,
        props?: any
    }[];
    dispatch?: any;
    map?: any;
}

@connect(state => ({
    opened: getOpened(state)
}))
export default class ModalWrapper extends React.PureComponent<IModalWrapperProps,
    {}> {
    render() {
        return <span>{this.props.opened.map(item => this.renderModal(item))}</span>;
    }

    renderModal(item) {
        const ModalComponent = item.modal;
        return (
            <ModalComponent
                key={item.id}
                {...item.props}
                modalProps={{
                    onClose: () => this.closeModal(item)
                }}
                onClose={() => this.closeModal(item)}
            />
        );
    }

    closeModal(item) {
        if (item.props && item.props.onClose) {
            item.props.onClose();
        }
        this.props.dispatch(closeModal(item.id));
    }
}
