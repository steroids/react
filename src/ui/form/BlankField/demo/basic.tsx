import * as React from 'react';
import {AutoCompleteField, DateTimeField} from '../../../form';
import BlankField from '../BlankField';

/**
 * Простой пример использзования BlankField.
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
        <BlankField text='BlankField text'>
            <AutoCompleteField items={items} />
            <DateTimeField />
        </BlankField>
    </>
);
