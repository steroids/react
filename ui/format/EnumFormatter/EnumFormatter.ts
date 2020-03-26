import * as React from 'react';
import {connect} from 'react-redux';
import _isArray from 'lodash-es/isArray';
import _isString from 'lodash-es/isString';
import _isFunction from 'lodash-es/isFunction';
import _isObject from 'lodash-es/isObject';
import {getEnumLabels} from '../../../reducers/fields';
import {formatter} from '../../../hoc';
import {IFormatterHocInput, IFormatterHocOutput} from '../../../hoc/formatter';
import {IConnectHocOutput} from '../../../hoc/connect';

export interface IEnumFormatterProps extends IFormatterHocInput {
    items?: string | {id: number | string, label: string}[] | {getLabel: () => string | any};
    value?: number | string,
}

interface IEnumFormatterPrivateProps extends IFormatterHocOutput, IConnectHocOutput {

}

/**
 * @param {array|function} items
 * @param {string|number} id
 * @returns {*}
 */
export const getLabel = (items, id) => {
    // Array
    if (_isArray(items)) {
        const finedItem = items.find(item => item.id === id);
        return finedItem ? finedItem.label : null;
    }
    // Enum
    if (_isObject(items) && _isFunction(items.getLabel)) {
        return items.getLabel(id);
    }
    return null;
};

@formatter()
@connect((state, props) => ({
    items: _isString(props.items)
        ? getEnumLabels(state, props.items)
        : props.items
}))
export default class EnumFormatter extends React.Component<IEnumFormatterProps & IEnumFormatterPrivateProps> {
    render() {
        return getLabel(this.props.items, this.props.value);
    }
}
