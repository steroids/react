import _get from 'lodash-es/get';
import _isObject from 'lodash-es/isObject';
import _isString from 'lodash-es/isString';
import {useContext} from 'react';

import {useComponents} from '../../../hooks';
import useModel from '../../../hooks/useModel';
import {FormContext} from '../../form/Form/Form';

/**
 * IFormatProps
 *
 * Компонент Format предназначен для форматирования значения на основе заданного форматтера.
 * Он позволяет кастомизировать отображение значения, используя переданный view React компонент.
 **/
export interface IFormatProps {
    attribute?: string,
    model?: string | ((...args: any[]) => any) | any,
    item?: any,
    component?: string | ((...args: any[]) => any),
    getFormatter?: any,
    ui?: any,
    emptyText?: any,

    [key: string]: any,
}

export function getFormatterPropsFromModel(model, attribute) {
    if (!model || !attribute) {
        return null;
    }

    const attributeMeta = model?.attributes.find(item => item.attribute === attribute);
    return attributeMeta?.formatter || null;
}

export default function Format(props: IFormatProps): JSX.Element {
    const context = useContext(FormContext);
    const components = useComponents();

    // Get field config from model
    const model = useModel(props.model || context?.model);
    let component = props.component || getFormatterPropsFromModel(model, props.attribute);
    if (_isString(component)) {
        component = components.ui.getFormatter('format.' + component);
    }

    return components.ui.renderView(component || 'format.DefaultFormatterView', {
        ...props,
        value: _get(props.item, props.attribute) || props.emptyText || null,
    });
}
