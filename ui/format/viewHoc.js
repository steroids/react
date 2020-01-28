import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash-es/get';
import _upperFirst from 'lodash-es/upperFirst';

const defaultConfig = {
    componentId: '',
    attributes: [''],
};

export default config => WrappedComponent => class ViewHoc extends React.Component {

    static WrappedComponent = WrappedComponent;

    /**
     * Proxy real name, prop types and default props for storybook
     */
    static displayName = WrappedComponent.displayName || WrappedComponent.name;
    static defaultProps = WrappedComponent.defaultProps;

    static propTypes = {
        ...WrappedComponent.propTypes,
        item: PropTypes.object,
        attribute: PropTypes.string,
    };

    render() {
        const _config = {
            ...defaultConfig,
            componentId: 'view.' + (WrappedComponent.displayName || WrappedComponent.name),
            ...config,
        };

        const valueProps = {};
        _config.attributes.forEach(key => {
            valueProps[`value${_upperFirst(key)}`] = _get(this.props.item, this.props[`attribute${_upperFirst(key)}`]);
        });

        return (
            <WrappedComponent
                {...valueProps}
                {...this.props}
            />
        );
    }

};
