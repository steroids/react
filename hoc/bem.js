import React from 'react';
import PropTypes from 'prop-types';

export default (className) => WrappedComponent => class BemHoc extends React.PureComponent {

    static WrappedComponent = WrappedComponent;

    static contextTypes = {
        components: PropTypes.object.isRequired,
    };

    render() {
        const props = {};
        if (className) {
            props.bem = this.context.components.html.bem(className);
        }

        return (
            <WrappedComponent
                {...this.props}
                {...props}
            />
        );
    }

};
