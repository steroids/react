import * as React from 'react';

export interface IFormHocInput {
    prefix?: string | boolean;
    size?: 'sm' | 'md' | 'lg' | string;
    label?: string | boolean;
    attribute?: string;
    model?: string | ((...args: any[]) => any) | any;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
    layout?: any;
    layoutProps?: any;
    component?: string | React.ComponentType | JSX.Element;
    onChange?: (...args: any[]) => any;
    className?: string;
    //layoutClassName?: string;
    //view?: any;
}

export interface IFormHocOutput extends IFormHocInput, IFormContext {
}

interface IFormHocConfig {
    appendPrefix?: boolean;
}

interface IFormHocPrivateProps {
}

export interface IFormContext {
    /*
        formId: PropTypes.string,
        prefix: PropTypes.string,
        model: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
            PropTypes.object
        ]),
        layout: PropTypes.oneOfType([
            PropTypes.oneOf(['default', 'inline', 'horizontal']),
            PropTypes.string,
            PropTypes.bool
        ]),
        layoutProps: PropTypes.object,
        size: PropTypes.oneOf(['sm', 'md', 'lg'])
     */
    formId?: string;
    model?: any;
    prefix?: string | boolean;
    layout?: any;
    layoutProps?: any;
    size?: 'sm' | 'md' | 'lg' | string;
}

export const FormContext = React.createContext<IFormContext>({
    size: 'md',
});

export default (config = {} as IFormHocConfig): any => WrappedComponent =>
    class FormHoc extends React.PureComponent<IFormHocPrivateProps & IFormHocInput> {
        static WrappedComponent = WrappedComponent;

        render() {
            return (
                <FormContext.Consumer>
                    {context => {
                        const outputProps = {
                            ...context,
                            ...this.props,
                            layout: this.props.layout || this.props.layout === false
                                ? this.props.layout
                                : context.layout,
                            layoutProps: {
                                ...context.layoutProps,
                                ...this.props.layoutProps,
                            },
                            prefix: config.appendPrefix
                                ? String(context.prefix || '') + String(this.props.prefix || '')
                                : this.props.prefix || context.prefix,

                        } as IFormHocOutput;
                        return (
                            <WrappedComponent {...outputProps}/>
                        );
                    }}
                </FormContext.Consumer>
            );
        }
    }
