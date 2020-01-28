import React from 'react';
import PropTypes from 'prop-types';

export default (config = {}) => WrappedComponent => class FormIdHoc extends React.PureComponent {

    static WrappedComponent = WrappedComponent;

    /**
     * Proxy real name, prop types and default props for storybook
     */
    static displayName = WrappedComponent.displayName || WrappedComponent.name;
    static propTypes = WrappedComponent.propTypes;
    static defaultProps = WrappedComponent.defaultProps;

    static contextTypes = {
        formId: PropTypes.string,
        model: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
            PropTypes.object,
        ]),
        prefix: PropTypes.string,
        layout: PropTypes.oneOfType([
            PropTypes.oneOf(['default', 'inline', 'horizontal']),
            PropTypes.string,
            PropTypes.bool,
        ]),
        layoutProps: PropTypes.object,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
    };

    render() {
        return (
            <WrappedComponent
                {...this.props}
                formId={this.props.formId || this.context.formId}
                model={this.props.model || this.context.model}
                prefix={config.appendPrefix ? (this.context.prefix || '') + (this.props.prefix || '') : this.props.prefix || this.context.prefix}
                layout={this.props.layout || this.context.layout}
                layoutProps={{
                    ...this.context.layoutProps,
                    ...this.props.layoutProps,
                }}
                size={this.props.size || this.context.size || 'md'}
            />
        );
    }

};
