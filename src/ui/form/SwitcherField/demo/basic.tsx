import * as React from 'react';
import SwitcherField from '../SwitcherField';

/**
 * Обычный пример использования SwitcherField.
 * @order 1
 * @col 6
 */

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
        <SwitcherField
            label='Basic'
            items={items}
        />
    </>
);
