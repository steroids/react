import * as React from 'react';
import NavField from '../NavField';

export const items = [
    {
        id: 1,
        label: 'First',
    },
    {
        id: 2,
        label: 'Second',
    },
    {
        id: 3,
        label: 'Third',
    },
    {
        id: 4,
        label: 'Fourth',
    },
];

/**
 * Basic
 * @order 1
 * @col 8
 */
export default () => (
    <>
        <NavField
            items={items}
            label='Basic'
        />
    </>
);
