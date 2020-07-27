import * as React from 'react';
import DropDownField from '../DropDownField';

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

export default () => (
    <>
        <DropDownField
            label='Auto Complete'
            autoComplete
            items={items}
        />
    </>
);