import DropDownField from '@steroidsjs/core/ui/form/DropDownField/DropDownField';
import * as React from 'react';

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
 * @col 6
 */
export default () => (
    <>
        <DropDownField
            label='Basic'
            items={items}
        />
    </>
);
