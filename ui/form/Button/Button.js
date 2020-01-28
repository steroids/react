import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {isSubmitting} from 'redux-form';
import {push} from 'connected-react-router';

import {components} from '../../../hoc';
import FieldLayout from '../FieldLayout';
import {getNavUrl} from '../../../reducers/navigation';

class ButtonInternal extends React.PureComponent {

    render() {
        const ButtonView = this.props.view || this.props.ui.getView('form.ButtonView');
        const disabled = this.props.submitting || this.props.disabled || this.props.isLoading;
        return (
            <ButtonView
                {...this.props}
                disabled={disabled}
                onClick={!disabled ? this.props.onClick : undefined}
            >
                {this.props.label || this.props.children}
            </ButtonView>
        );
    }

}

export default
@connect(
    (state, props) => ({
        submitting: props.formId ? isSubmitting(props.formId)(state) : !!props.submitting,
        to: props.toRoute ? getNavUrl(state, props.toRoute, props.toRouteParams) : props.to,
    })
)
@components('ui')
class Button extends React.PureComponent {

    static propTypes = {
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.any,
        ]),
        type: PropTypes.oneOf(['button', 'submit']),
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        color: PropTypes.oneOf([
            'primary',
            'secondary',
            'success',
            'danger',
            'warning',
            'info',
            'light',
            'dark',
        ]),
        link: PropTypes.bool,
        outline: PropTypes.bool,
        url: PropTypes.string,
        to: PropTypes.string,
        confirm: PropTypes.string,
        onClick: PropTypes.func,
        disabled: PropTypes.bool,
        submitting: PropTypes.bool,
        block: PropTypes.bool,
        className: PropTypes.string,
        view: PropTypes.elementType,
        toRoute: PropTypes.string,
        toRouteParams: PropTypes.object,
    };

    static defaultProps = {
        type: 'button',
        color: 'primary',
        outline: false,
        disabled: false,
        submitting: false,
        block: false,
        className: '',
    };

    static contextTypes = {
        formId: PropTypes.string,
        layout: PropTypes.oneOfType([
            PropTypes.oneOf(['default', 'inline', 'horizontal']),
            PropTypes.string,
            PropTypes.bool,
        ]),
        layoutProps: PropTypes.object,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
    };

    constructor() {
        super(...arguments);

        this._isMounted = false;

        this.state = {
            isLoading: false,
        };

        this._onClick = this._onClick.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const button = (
            <ButtonInternal
                {...this.props}
                isLoading={this.state.isLoading}
                url={this.props.link && !(this.props.url || this.props.to)
                    ? '#'
                    : this.props.url || this.props.to}
                onClick={this._onClick}
                formId={this.context.formId}
                layout={this.context.layout}
                layoutProps={this.context.layoutProps}
                size={this.context.size || this.props.size}
            />
        );

        if (this.context.formId && this.props.layout !== false) {
            return (
                <FieldLayout
                    {...this.props}
                    label={null}
                    layout={this.props.layout || this.context.layout}
                    layoutProps={{
                        ...this.context.layoutProps,
                        ...this.props.layoutProps,
                    }}
                    size={this.props.size}
                >
                    {button}
                </FieldLayout>
            );
        }

        return button;
    }

    _onClick(e) {
        e.stopPropagation();

        if (this.props.confirm && !confirm(this.props.confirm)) {
            e.preventDefault();
            return;
        }
        if (this.props.to || this.props.to === '') {
            this._onLinkClick(e, this.props.to);
        }

        if (this.props.onClick) {
            const result = this.props.onClick(e);

            if (result instanceof Promise) {
                this.setState({isLoading: true});
                result
                    .then(() => {
                        if (this._isMounted) {
                            this.setState({isLoading: false});
                        }
                    })
                    .catch(e => {
                        if (this._isMounted) {
                            this.setState({isLoading: false});
                        }
                        throw e;
                    });
            }
        }
    }

    _onLinkClick(e, url) {
        if (!e.ctrlKey && !e.shiftKey && !e.metaKey) {
            e.preventDefault();
            this.props.dispatch(push(url));
        }
    };

}
