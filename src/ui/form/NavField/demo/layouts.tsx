import * as React from 'react';
import NavField from '../NavField';

/**
 * Демонстрация всех видов использования свойства layout
 * @order 5
 * @col 12
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
    <div style={{display: 'flex', gridGap: '10px', alignItems: 'center'}}>
        <NavField navProps={{layout: 'button'}} items={items} />
        <NavField navProps={{layout: 'list'}} items={items} />
        <NavField navProps={{layout: 'link'}} items={items} />
        <NavField navProps={{layout: 'tabs'}} items={items} />
        <NavField navProps={{layout: 'navbar'}} items={items} />
        <NavField navProps={{layout: 'icon'}} items={items} />
    </div>
);
