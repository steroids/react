import * as React from 'react';

import Nav from '../Nav';

export const items = [
    {
        id: 'one',
        label: 'One',
        content: () => (
            <div className='card'>
                <div className='card-body'>
                    One
                </div>
            </div>
        ),
    },
    {
        id: 'two',
        label: 'Two',
        content: () => (
            <div className='card'>
                <div className='card-body'>
                    Two
                </div>
            </div>
        ),
    },
    {
        id: 'three',
        label: 'Three',
        content: () => (
            <div className='card'>
                <div className='card-body'>
                    Three
                </div>
            </div>
        ),
    },
];

/**
 * Basic
 * @order 1
 * @col 6
 */
export default () => (
    <>
        <Nav items={items} />
    </>
);
