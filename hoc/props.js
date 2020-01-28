import React from 'react';
import _isFunction from 'lodash-es/isFunction';

export default customProps => WrappedComponent => class PropsHoc extends React.PureComponent {

    static WrappedComponent = WrappedComponent;

    render() {
        const props = _isFunction(customProps) ? customProps(this.props) : customProps;
        return (
            <WrappedComponent
                {...this.props}
                {...props}
            />
        );
    }

};
