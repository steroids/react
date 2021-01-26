import * as React from 'react';
import _isArray from 'lodash-es/isArray';
import _isString from 'lodash-es/isString';
import _isFunction from 'lodash-es/isFunction';
import _isObject from 'lodash-es/isObject';
import {getEnumLabels} from '../../../reducers/fields';
import {components, connect} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IEnumFormatterProps {

    /**
     * Перечисление элементов.
     * 1) Может быть строкой вида: `app.geo.enums.Cities`
     * 2) Массивом: [{id: 1, label: "London"}]
     */
    items?: string
        | {id: number | string, label: string}[]
        | {getLabel: () => string | any};

    /**
     * Уникальный идентификатор элемента из `items`
     * @example unique label
     */
    value?: number | string,
    view?: CustomView;
    [key: string]: any;
}

/**
 * @param {array|function} items
 * @param {string|number} id
 * @returns {*}
 */
export const getLabel = (items, id) => {
    // Array
    if (_isArray(items)) {
        const foundItem = items.find(item => item.id === id);
        return foundItem ? foundItem.label : null;
    }
    // Enum
    if (_isObject(items) && _isFunction(items.getLabel)) {
        return items.getLabel(id);
    }
    return null;
};

@connect((state, props) => ({
    items: _isString(props.items)
        ? getEnumLabels(state, props.items)
        : props.items
}))
@components('ui')
export default class EnumFormatter extends React.Component<IEnumFormatterProps & IComponentsHocOutput> {
    render() {
        const EnumFormatterView = this.props.view || this.props.ui.getView('format.DefaultFormatterView');
        return <EnumFormatterView
            value={getLabel(this.props.items, this.props.value)}
        />;
    }
}
