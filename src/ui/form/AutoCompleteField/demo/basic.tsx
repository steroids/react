import * as React from 'react';
import AutoCompleteField from '../AutoCompleteField';

/**
 * Простой пример использзования AutoAutoCompleteField с коллекцией элементов вложенных в {props.items} .
 * @order 1
 * @col 6
 */

export const items = [
    {
        id: '1',
        label: 'Moscow',
    },
    {
        id: '2',
        label: 'Krasnoyarsk',
    },
    {
        id: '3',
        label: 'Krasnodar',
    },
];

export default () => (
    <>
        <AutoCompleteField
            label='Write city'
            items={items}
            searchOnFocus
        />
    </>
);
