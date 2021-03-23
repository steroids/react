import * as React from 'react';
import {useContext} from 'react';
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
    const model = props.model || context.model;

    // Get component
    const component = props.component
        || components.ui.getModel(model)?.fields?.[props.attribute]?.component
        || 'InputField';
    const ComponentField = _isString(component)
        ? components.ui.getField(`form.${component}`)
        : component;

    // Render
    return _isFunction(ComponentField)
        ? ComponentField(props)
        : <ComponentField {...props} />;
}
