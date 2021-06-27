import * as React from 'react';
import AutoCompleteField from '../AutoCompleteField';

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

/**
 * Basic
 * @order 1
 * @col 6
 */
export default () => (
    <>
        <AutoCompleteField
            label='Write city'
            items={items}
            searchOnFocus
        />
    </>
);
