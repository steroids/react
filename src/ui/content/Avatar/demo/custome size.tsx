import * as React from 'react';
import {Avatar} from '@steroidsjs/core/ui/content';

/**
 * Custom size in numbers
 * @order 4
 * @col 3
 */

export default () => (
    <div style={{display: 'grid', gridGap: '20px'}}>
        <div style={{display: 'flex', gridGap: '10px'}}>
            <Avatar size={20} src='https://i.ibb.co/1fWbXCt/F-1.png' status />
            <Avatar size={20} shape='square' title='Kozhin Dev' />
        </div>
        <div style={{display: 'flex', gridGap: '10px'}}>
            <Avatar size={100} src='https://i.ibb.co/1fWbXCt/F-1.png' status />
            <Avatar size={100} shape='square' title='Kozhin Dev' />
        </div>
    </div>
);
