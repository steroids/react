import * as React from 'react';
import {Avatar} from '@steroidsjs/core/ui/content';

/**
 * Basic sizes with title and online status
 * @order 2
 * @col 3
 */

export default () => (
    <div style={{display: 'grid', gridGap: '20px'}}>
        <div style={{display: 'flex', gridGap: '10px'}}>
            <Avatar size='small' title='Kozhin Dev' />
            <Avatar size='small' title='Kozhin Dev' status />
        </div>
        <div style={{display: 'flex', gridGap: '10px'}}>
            <Avatar size='middle' title='Kozhin Dev' />
            <Avatar size='middle' title='Kozhin Dev' status />
        </div>
        <div style={{display: 'flex', gridGap: '10px'}}>
            <Avatar size='large' title='Kozhin Dev' />
            <Avatar size='large' title='Kozhin Dev' status />
        </div>
        <div style={{display: 'flex', gridGap: '10px'}}>
            <Avatar size='x-large' title='Kozhin Dev' />
            <Avatar size='x-large' title='Kozhin Dev' status />
        </div>
    </div>
);
