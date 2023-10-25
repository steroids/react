import React, {useContext, useMemo} from 'react';
import _isString from 'lodash-es/isString';
import Field from '../Field';
import {IFieldProps} from '../Field/Field';
import {FormContext, IFormContext} from '../Form/Form';
import {useComponents} from '../../../hooks';

/**
 * FieldSet
 * Компонент для группировки полей формы
 */
export interface IFieldSetProps extends IFormContext {
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
     * Дополнительный CSS-класс для '<fieldset>...</fieldset>'
     */
    className?: CssClassName,

    [key: string]: any,
}

export interface IFieldSetViewProps {
    className?: CssClassName,
    children?: React.ReactNode,
    label?: string | any,
}

function FieldSet(props: IFieldSetProps): JSX.Element {
    const components = useComponents();
    const context = useContext(FormContext);

    const contextValue = useMemo(() => ({
        formId: props.formId || context.formId,
        model: props.model || context.model,
        prefix: [context.prefix, props.prefix]
            .filter(Boolean)
            .join('.'),
        size: props.size || context.size,
        provider: context.provider,
        reducer: context.reducer,
    }), [context.formId, context.model, context.prefix, context.provider, context.reducer,
        context.size, props.formId, props.model, props.prefix, props.size]);

    const FieldSetView = props.view || components.ui.getView('form.FieldSetView');

    return (
        <FormContext.Provider value={contextValue}>
            <FieldSetView
                className={props.className}
                label={props.label}
                {...props}
            >
                {props.children}
                {(props.fields || []).map((field: any, index) => (
                    <Field
                        key={index}
                        {...(_isString(field) ? {attribute: field} : field)}
                        prefix={contextValue.prefix}
                    />
                ))}
            </FieldSetView>
        </FormContext.Provider>
    );
}

export default FieldSet;
