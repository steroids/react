import React from 'react';
import PropTypes from 'prop-types';

export default (...names) => WrappedComponent => class ComponentHoc extends React.PureComponent {

    static WrappedComponent = WrappedComponent;

    static contextTypes = {
        components: PropTypes.object.isRequired,
    };

    render() {
        const props = {};
        names.forEach(items => {
            [].concat(items).forEach(name => {
                props[name] = this.context.components[name];
            });
        });

        return (
            <WrappedComponent
                {...this.props}
                {...props}
                components={this.context.components}
            />
        );
    }

};
