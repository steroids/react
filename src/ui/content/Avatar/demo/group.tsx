import * as React from 'react';
import {Avatar, AvatarGroup} from '@steroidsjs/core/ui/content';

/**
 * Group of avatars
 * @order 5
 * @col 12
 */

export default () => (
    <div style={{display: 'flex', gridGap: '20px'}}>
        <AvatarGroup>
            <Avatar size='small' src='https://i.ibb.co/1fWbXCt/F-1.png' />
            <Avatar size='small' title='Kozhin Dev' />
            <Avatar size='small' src='https://i.ibb.co/1fWbXCt/F-1.png' status />
            <Avatar size='small' title='Kozhin Dev' status />
        </AvatarGroup>
        <AvatarGroup maxCount={2}>
            <Avatar size='middle' src='https://i.ibb.co/1fWbXCt/F-1.png' />
            <Avatar size='middle' title='Kozhin Dev' />
            <Avatar size='middle' src='https://i.ibb.co/1fWbXCt/F-1.png' status />
            <Avatar size='middle' title='Kozhin Dev' status />
        </AvatarGroup>
        <AvatarGroup>
            <Avatar size='large' src='https://i.ibb.co/1fWbXCt/F-1.png' />
            <Avatar size='large' title='Kozhin Dev' />
            <Avatar size='large' src='https://i.ibb.co/1fWbXCt/F-1.png' status />
            <Avatar size='large' title='Kozhin Dev' status />
        </AvatarGroup>
        <AvatarGroup maxCount={3}>
            <Avatar size='x-large' src='https://i.ibb.co/1fWbXCt/F-1.png' />
            <Avatar size='x-large' title='Kozhin Dev' />
            <Avatar size='x-large' src='https://i.ibb.co/1fWbXCt/F-1.png' status />
            <Avatar size='x-large' title='Kozhin Dev' status />
        </AvatarGroup>
    </div>
);
