import * as React from 'react';
import {FormContext, IFormContext, mergeLayoutProp} from '../../../hoc/form';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';
import Field from '../Field';
import _isString from 'lodash-es/isString';
import {IFieldProps} from '../Field/Field';

export interface IFieldSetProps extends IFormContext, IComponentsHocOutput {

    /**
     * Конфигурационный массив с полями формы
     */
    fields?: IFieldProps[],

    /**
     * Название поля
     * @example Save
     */
    label?: any,
    view?: CustomView,
    className?: CssClassName,
}

@components('ui')
export default class FieldSet extends React.PureComponent<IFieldSetProps> {
    render() {
        const FieldSetView = this.props.view || this.props.ui.getView('form.FieldSetView');
        return (
            <FormContext.Consumer>
                {context => {
                    return (
                        <FormContext.Provider
                            value={{
                                formId: this.props.formId || context.formId,
                                model: this.props.model || context.model,
                                prefix: [context.prefix, this.props.prefix]
                                    .filter(Boolean)
                                    .join('.'),
                                layout: mergeLayoutProp(context.layout, this.props.layout),
                            }}
                        >
                            <FieldSetView
                                className={this.props.className}
                                label={this.props.label}
                                {...this.props}
                            >
                                {this.props.children}
                                {this.props.fields &&
                                this.props.fields.map((field: any, index) => (
                                    <Field
                                        key={index}
                                        {...(_isString(field) ? {attribute: field} : field)}
                                    />
                                ))}
                            </FieldSetView>
                        </FormContext.Provider>
                    )
                }}
            </FormContext.Consumer>
        );
    }
}
