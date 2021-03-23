import _get from 'lodash-es/get';
import _isObject from 'lodash-es/isObject';
import _isFunction from 'lodash-es/isFunction';
import _isString from 'lodash-es/isString';
import {useComponents} from '@steroidsjs/core/hooks';
import {useContext} from 'react';
import {FormContext} from '@steroidsjs/core/ui/form/Form/Form';

export interface IFormatProps {
    attribute?: string;
    model?: string | ((...args: any[]) => any) | any;
    item?: any;
    component?: string | ((...args: any[]) => any);
    getFormatter?: any;
    ui?: any;
    emptyText?: any;

    [key: string]: any;
}

export function getFormatterPropsFromModel(model, attribute) {
    if (!model || !attribute) {
        return null;
    }
    if (_isFunction(model.formatters)) {
        return model.formatters()[attribute] || null;
    }
    if (_isObject(model.formatters)) {
        return model.formatters[attribute] || null;
    }
    return null;
}

export default function Format(props: IFormatProps) {
    const context = useContext(FormContext);
    const components = useComponents();

    // Get field config from model
    const model = props.model || context?.model;
    props = {
        ...getFormatterPropsFromModel(model, props.attribute),
        ...props,
    };
    const component = _isString(props.component)
        ? components.getFormatter('format.' + props.component)
        : props.component;

    return components.ui.renderView(component || 'format.DefaultFormatterView', {
        ...props,
        value: _get(props.item, props.attribute) || props.emptyText || null,
    });
}
