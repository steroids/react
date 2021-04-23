import * as React from 'react';
import _isString from 'lodash-es/isString';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';
import Field from '../Field';
import {IFieldProps} from '../Field/Field';
import {FormContext, IFormContext} from '../Form/Form';
import {mergeLayoutProp} from '../../../utils/form';

/**
 * FieldSet
 * Компонент для группировки полей формы с помощью тега <fieldset>...</fieldset> и заголовка <legend>...</legend>
 */
export interface IFieldSetProps extends IFormContext, IComponentsHocOutput {
    /**
     * Конфигурационный массив с полями формы
     */
    fields?: IFieldProps[],

    /**
     * Заголовок для группы полей в форме
     * @example Save
     */
    label?: any,

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView,

    /**
     * Дополнительный CSS-класс для <fieldset>...</fieldset>
     */
    className?: CssClassName,

    [key: string]: any,
}

export interface IFieldSetViewProps {
    className?: string,
    children?: React.ReactNode,
    label?: string | any,
}

@components('ui')
export default class FieldSet extends React.PureComponent<IFieldSetProps> {
    render() {
        const FieldSetView = this.props.view || this.props.ui.getView('form.FieldSetView');
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
                        }}
                    >
                        <FieldSetView
                            className={this.props.className}
                            label={this.props.label}
                            {...this.props}
                        >
                            {this.props.children}
                            {(this.props.fields || []).map((field: any, index) => (
                                <Field
                                    key={index}
                                    {...(_isString(field) ? {attribute: field} : field)}
                                    prefix={null}
                                />
                            ))}
                        </FieldSetView>
                    </FormContext.Provider>
                )}
            </FormContext.Consumer>
        );
    }
}
