import * as React from 'react';
import {Avatar} from '@steroidsjs/core/ui/content';

/**
 * Basic sizes with image source and online status
 * @order 1
 * @col 3
 */

export default () => (
    <div style={{display: 'grid', gridGap: '20px'}}>
        <div style={{display: 'flex', gridGap: '10px'}}>
            <Avatar size='small' src='https://i.ibb.co/1fWbXCt/F-1.png' />
            <Avatar size='small' src='https://i.ibb.co/1fWbXCt/F-1.png' status />
        </div>
        <div style={{display: 'flex', gridGap: '10px'}}>
            <Avatar size='middle' src='https://i.ibb.co/1fWbXCt/F-1.png' />
            <Avatar size='middle' src='https://i.ibb.co/1fWbXCt/F-1.png' status />
        </div>
        <div style={{display: 'flex', gridGap: '10px'}}>
            <Avatar size='large' src='https://i.ibb.co/1fWbXCt/F-1.png' />
            <Avatar size='large' src='https://i.ibb.co/1fWbXCt/F-1.png' status />
        </div>
        <div style={{display: 'flex', gridGap: '10px'}}>
            <Avatar size='x-large' src='https://i.ibb.co/1fWbXCt/F-1.png' />
            <Avatar size='x-large' src='https://i.ibb.co/1fWbXCt/F-1.png' status />
        </div>
    </div>
);
