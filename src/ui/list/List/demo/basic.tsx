import * as React from 'react';

import List from '../List';

export const demoItems = [
    {
        id: 1,
        title: 'Racing car sprays burning fuel into crowd.',
    },
    {
        id: 2,
        title: 'Japanese princess to wed commoner.',
    },
    {
        id: 3,
        title: 'Australian walks 100km after outback crash.',
    },
    {
        id: 4,
        title: 'Man charged over missing wedding girl.',
    },
    {
        id: 5,
        title: 'Los Angeles battles huge wildfires.',
    },
];

/**
 * Basic
 * @order 1
 * @col 6
 */
export default () => (
    <List
        listId='ListDemoBasic'
        items={demoItems}
        className='list-group'
        itemProps={{
            className: 'list-group-item',
        }}
    />
);
