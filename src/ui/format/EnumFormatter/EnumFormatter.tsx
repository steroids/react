import _isArray from 'lodash-es/isArray';
import _isFunction from 'lodash-es/isFunction';
import _isObject from 'lodash-es/isObject';
import {useComponents, useDataProvider} from '../../../hooks';
import {DataProviderItems} from '../../../hooks/useDataProvider';

export interface IEnumFormatterProps {

    /**
     * Перечисление элементов.
     * 1) Может быть строкой вида: `app.geo.enums.Cities`
     * 2) Массивом: [{id: 1, label: "London"}]
     */
    items?: DataProviderItems;

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

export default function EnumFormatter(props: IEnumFormatterProps) {
    const components = useComponents();
    const items = useDataProvider({items: props.items});

    return components.ui.renderView(props.view || 'format.DefaultFormatterView', {
        value: getLabel(items, props.value),
    });
}
