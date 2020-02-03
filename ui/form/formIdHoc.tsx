import * as React from 'react';
import {IFieldProps} from './Field/Field';
import {FormContext} from './Form/Form';

interface IFormIdConfig {
    appendPrefix?: string | boolean;
}

interface IFormIdProps extends IFieldProps {
}

export default (config = {} as IFormIdConfig): any => WrappedComponent =>
    class FormIdHoc extends React.PureComponent<IFormIdProps> {
        static WrappedComponent = WrappedComponent;

        static propTypes = WrappedComponent.propTypes;
        static defaultProps = WrappedComponent.defaultProps;

        render() {
            return (
                <FormContext.Consumer>
                    {context => (
                        <WrappedComponent
                            {...this.props}
                            formId={this.props.formId || context.formId}
                            model={this.props.model || context.model}
                            prefix={
                                config.appendPrefix
                                    ? String(context.prefix || "") + String(this.props.prefix || "")
                                    : this.props.prefix || context.prefix
                            }
                            layout={this.props.layout || context.layout}
                            layoutProps={{
                                ...context.layoutProps,
                                ...this.props.layoutProps
                            }}
                            size={this.props.size || context.size || 'md'}
                        />
                    )}
                </FormContext.Consumer>
            );
        }
    }
