import * as React from 'react';

/**
 * Form HOC
 * Получает из контекста данные формы (formId, model, prefix, layout, ..) и прокидывает их в качестве `props` в компонент.
 * Используется во всех полях формы (`*Field.tsx`) для получения данных из контекста.
 */
export interface IFormHocInput {
    prefix?: string | boolean;
    label?: string | boolean | any;
    attribute?: string;
    model?: string | ((...args: any[]) => any) | any;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
    layout?: FormLayout;
    component?: string | React.ComponentType | JSX.Element;
    onChange?: (...args: any[]) => any;
    className?: CssClassName;
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
     */
    formId?: string;
    model?: any;
    prefix?: string | boolean;
    layout?: FormLayout;
}

export const mergeLayoutProp = (layout1, layout2) => {
    return typeof layout1 === 'object' || typeof layout2 === 'object'
        ? {
            ...(typeof layout1 === 'object' ? layout1 : {layout: layout1}),
            ...(typeof layout2 === 'object' ? layout2 : {layout: layout2}),
        }
        : (layout2 || layout2 === false ? layout2 : layout1)
};

export const FormContext = React.createContext<IFormContext>({});

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
                            layout: mergeLayoutProp(context.layout, this.props.layout),
                            prefix: this.props.prefix || context.prefix,

                        } as IFormHocOutput;
                        return (
                            <WrappedComponent {...outputProps}/>
                        );
                    }}
                </FormContext.Consumer>
            );
        }
    }
