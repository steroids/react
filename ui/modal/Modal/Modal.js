import React from 'react';
import PropTypes from 'prop-types';

import {components} from '../../../hoc';

@components('ui')
export default class Modal extends React.PureComponent {

    static propTypes = {
        onClose: PropTypes.func,
        view: PropTypes.elementType,
    };

    render() {
        const ModalView = this.props.view || this.props.ui.getView('modal.ModalView');

        return (
            <ModalView
                {...this.props}
                onClose={this.props.onClose}
            >
                {this.props.children}
            </ModalView>
        );
    }
}
