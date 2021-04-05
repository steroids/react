import * as React from 'react';
import {useContext, useMemo} from 'react';
import _isString from 'lodash-es/isString';
import _isFunction from 'lodash-es/isFunction';

import {useComponents} from '../../../hooks';
import {FormContext} from '../Form/Form';
import {IFieldWrapperInputProps} from './fieldWrapper';

export interface IFieldProps extends IFieldWrapperInputProps {
    attribute?: any;
    model?: any;
    component?: any;
    [key: string]: any,
}

export default function Field(props: IFieldProps) {
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
        ...fieldModel.searchFieldProps
    }

    // Render
    return _isFunction(ComponentField)
        ? ComponentField(componentProps)
        : <ComponentField {...componentProps} />;
}
