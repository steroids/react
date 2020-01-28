import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {closeModal} from '../../../actions/modal';
import {getOpened} from '../../../reducers/modal';

export default
@connect(
    state => ({
        opened: getOpened(state),
    })
)
class ModalWrapper extends React.PureComponent {
    static propTypes = {
        opened: PropTypes.arrayOf(PropTypes.shape({
            modal: PropTypes.elementType,
            props: PropTypes.object,
        })),
    };

    render() {
        return (
            <span>
                {this.props.opened.map(item => this.renderModal(item))}
            </span>
        );
    }

    renderModal(item) {
        const ModalComponent = item.modal;

        return (
            <ModalComponent
                key={item.id}
                {...item.props}
                modalProps={{
                    onClose: () => this.closeModal(item),
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
