import * as React from 'react';
import Controls from '../Controls';

export const controls = [
    {
        id: 'back',
        onClick: () => alert('Go back'),
    }, {
        id: 'create',
        onClick: () => alert('Something is created'),
    },
    {
        id: 'view',
        onClick: () => alert('Something is shown'),
    },
    {
        id: 'update',
        onClick: () => alert('Something is updated'),
    },
    {
        id: 'delete',
        onClick: () => alert('Something is deleted'),
    },
];

/**
 * Basic
 * @order 1
 * @col 6
 */
export default () => (
    <>
        <Controls items={controls} />
    </>
);
