import * as React from 'react';
import {ChangeEvent} from 'react';
import {normalizeLayout} from '../ui/form/Form/Form';
import {FormContext} from '../hooks/form';

/**
 * Form HOC
 * Получает из контекста данные формы (formId, model, prefix, layout, ..) и прокидывает их в качестве `props` в
 * компонент. Используется во всех полях формы (`*Field.tsx`) для получения данных из контекста.
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
    onChange?: ((...args: any[]) => any);
    className?: CssClassName;
    //layoutClassName?: string;
    //view?: any;
}

export type IFormHocOutput = IFormHocInput

interface IFormHocConfig {
    appendPrefix?: boolean;
}

export const mergeLayoutProp = (layout1, layout2) => {
    layout1 = layout1 ? normalizeLayout(layout1) : null;
    layout2 = layout2 ? normalizeLayout(layout2) : null;
    return layout1 || layout2 ? {...layout2, ...layout1} : null;
};

export default (config = {} as IFormHocConfig): any => WrappedComponent => class FormHoc extends React.Component<IFormHocInput> {
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
                            <WrappedComponent {...outputProps} />
                        );
                    }}
                </FormContext.Consumer>
            );
        }
};
