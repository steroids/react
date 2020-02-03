import * as React from 'react';
import {FormContext} from '../Form/Form';

interface IFieldSetProps {
    formId?: string,
    model?: string | ((...args: any[]) => any) | any;
    prefix?: string;
    layout?: ('default' | 'inline' | 'horizontal') | string | boolean;
    layoutProps?: any;
    size?: 'sm' | 'md' | 'lg';
}

export default class FieldSet extends React.PureComponent<IFieldSetProps, {}> {
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
