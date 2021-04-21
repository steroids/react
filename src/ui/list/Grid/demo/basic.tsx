import * as React from 'react';

import Grid from '../Grid';

export const items = [
    {
        name: 'Ivan',
        secondName: 'Ivanov',
        work: 'development',
    },
    {
        name: 'Petr',
        secondName: 'Petrov',
        work: 'manager',
    },
    {
        name: 'Jhon',
        secondName: 'Doe',
        work: 'designer',
    },
];

export const columns = [
    {
        label: 'Name',
        attribute: 'name',
    },
    {
        label: 'Second name',
        attribute: 'secondName',
    },
    {
        label: 'Work',
        attribute: 'work',
    },
];

/**
 * Basic
 * @order 1
 * @col 8
 */
export default () => (
    <>
        <Grid
            listId='GridBasicDemo'
            items={items}
            columns={columns}
        />
    </>
);
