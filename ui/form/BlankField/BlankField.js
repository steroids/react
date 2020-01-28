import React from 'react';
import PropTypes from 'prop-types';

import fieldHoc from '../fieldHoc';

export default
@fieldHoc({
    componentId: 'form.BlankField',
})
class BlankField extends React.PureComponent {

    static propTypes = {
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
        ]),
        hint: PropTypes.string,
        attribute: PropTypes.string,
        text: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node,
        ]),
        isInvalid: PropTypes.bool,
        view: PropTypes.elementType,
    };

    render() {
        return (
            <span>
                {this.props.text || this.props.children}
            </span>
        );
    }

}
