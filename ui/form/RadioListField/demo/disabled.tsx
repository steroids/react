import * as React from 'react';
import RadioListField from '../RadioListField';

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
        <RadioListField
            label='Disabled'
            disabled
            items={items}
        />
    </>
);