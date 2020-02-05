import * as React from 'react';
import {FormContext, IFormContext} from '../../../hoc/form';

interface IFieldSetProps extends IFormContext {
}

export default class FieldSet extends React.PureComponent<IFieldSetProps> {
    render() {
        return (
            <FormContext.Consumer>
                {context => (
                    <FormContext.Provider
                        value={{
                            formId: this.props.formId || context.formId,
                            model: this.props.model || context.model,
                            prefix: [context.prefix, this.props.prefix]
                                .filter(Boolean)
                                .join('.'),
                            layout: this.props.layout || context.layout,
                            layoutProps: {
                                ...context.layoutProps,
                                ...this.props.layoutProps
                            },
                            size: this.props.size || context.size
                        }}
                    >
                        {this.props.children}
                    </FormContext.Provider>
                )}
            </FormContext.Consumer>
        );
    }
}
