import * as React from 'react';
import {useContext, useMemo} from 'react';
import _isString from 'lodash-es/isString';
import _isFunction from 'lodash-es/isFunction';

import {useComponents} from '../../../hooks';
import {FormContext} from '../Form/Form';
import {IFieldWrapperInputProps} from './fieldWrapper';
import {Model} from '../../../components/MetaComponent';

/**
 * Field
 * Компонент, который рендерит соответствующее поле, исходя из переданной модели и названия аттрибута.
 * По дефолту будет отрендерен InputField.
 * Также можно не использовать модель, а передавать компонент поля напрямую через пропсы.
 */
export interface IFieldProps extends IFieldWrapperInputProps {
    /**
     * Аттрибут (название) поля в форме
     * @example isVisible
     */
    attribute?: any;

    /**
     * Модель с полями формы
     * @example {attributes: [{attribute: 'category', field: 'DropDownField'}]}
     */
    model?: Model;

    /**
     * Компонент поля
     * @example DropDownField
     */
    component?: any;

    [key: string]: any,
}

export default function Field(props: IFieldProps): JSX.Element {
    const components = useComponents();

    // Get model
    const context = useContext(FormContext);
    const fieldModel = useMemo(() => {
        const model = props.model || context.model;
        const result = (components.ui.getModel(model)?.attributes || [])
            .find(field => field.attribute === props.attribute);

        return result || {};
    }, [components, props.model, context.model, props.attribute]);

    const component = props.component
        || fieldModel.searchField
        || fieldModel.field
        || 'InputField';

    const ComponentField = _isString(component)
        ? components.ui.getField(`form.${component}`)
        : component;

    const componentProps = {
        ...fieldModel,
        ...props,
        ...fieldModel.fieldProps,
        ...fieldModel.searchFieldProps,
    };

    // Render
    return _isFunction(ComponentField)
        ? ComponentField(componentProps)
        : <ComponentField {...componentProps} />;
}
