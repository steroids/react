import * as React from 'react';

import Grid from '../Grid';

export const items = [
    {
        id: 1,
        name: 'Ivan',
        secondName: 'Ivanov',
        work: 'development',
    },
    {
        id: 2,
        name: 'Petr',
        secondName: 'Petrov',
        work: 'manager',
    },
    {
        id: 3,
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
