import * as React from 'react';
import {FormContext, IFormContext, mergeLayoutProp} from '../../../hoc/form';

export interface IFieldSetProps extends IFormContext {
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
                            layout: mergeLayoutProp(context.layout, this.props.layout),
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
