import * as React from 'react';
import {connect} from 'react-redux';
import {isSubmitting} from 'redux-form';
import {push} from 'connected-react-router';
import {components} from '../../../hoc';
import FieldLayout from '../FieldLayout';
import {getNavUrl} from '../../../reducers/navigation';
import {FormContext, IFormContext} from '../Form/Form';
import {IComponentsContext} from '../../../hoc/components';

interface IButtonProps extends IComponentsContext {
    label?: string | any;
    type?: 'button' | 'submit';
    size?: 'sm' | 'md' | 'lg';
    color?:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'danger'
        | 'warning'
        | 'info'
        | 'light'
        | 'dark';
    link?: boolean;
    isLoading?: boolean;
    outline?: boolean;
    url?: string;
    to?: string;
    confirm?: string;
    onClick?: (...args: any[]) => any;
    disabled?: boolean;
    submitting?: boolean;
    block?: boolean;
    className?: string;
    view?: any;
    toRoute?: string;
    toRouteParams?: any;
    dispatch?: any;
    layout?: any;
    layoutProps?: any;
}

type ButtonState = {
    isLoading?: boolean
};

@connect((state: any, props: any) => ({
    submitting: props.formId
        ? isSubmitting(props.formId)(state)
        : !!props.submitting,
    to: props.toRoute
        ? getNavUrl(state, props.toRoute, props.toRouteParams)
        : props.to
}))
@components('ui')
export default class Button extends React.PureComponent<IButtonProps,
    ButtonState> {
    _isMounted: any;
    context: boolean;
    static defaultProps = {
        type: 'button',
        color: 'primary',
        outline: false,
        disabled: false,
        submitting: false,
        block: false,
        className: ""
    };

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            isLoading: false
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
        return (
            <FormContext.Consumer>
                {context => this.renderContent(context)}
            </FormContext.Consumer>
        );
    }

    renderContent(context: IFormContext) {
        const ButtonView = this.props.view || this.props.ui.getView('form.ButtonView');
        const disabled = this.props.submitting || this.props.disabled || this.props.isLoading;
        const layout = this.props.layout || context.layout;
        const layoutProps = {
            ...context.layoutProps,
            ...this.props.layoutProps,
        };
        const button = (
            <ButtonView
                {...this.props}
                isLoading={this.state.isLoading}
                url={
                    this.props.link && !(this.props.url || this.props.to)
                        ? '#'
                        : this.props.url || this.props.to
                }
                formId={context.formId}
                layout={context.layout}
                layoutProps={layoutProps}
                size={context.size || this.props.size}
                disabled={disabled}
                onClick={!disabled ? this._onClick : undefined}
            >
                {this.props.label || this.props.children}
            </ButtonView>
        );

        if (context.formId && layout !== false) {
            return (
                <FieldLayout
                    {...this.props}
                    label={null}
                    layout={layout}
                    layoutProps={layoutProps}
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
        if (this.props.to || this.props.to === "") {
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
    }
}
