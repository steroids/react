import * as React from 'react';
import {Avatar} from '../../../content';

/**
 * Basic sizes with image source, online status and square shape
 * @order 3
 * @col 3
 */

export default () => (
    <div style={{display: 'grid', gridGap: '20px'}}>
        <div style={{display: 'flex', gridGap: '10px'}}>
            <Avatar size='small' shape='square' src='https://i.ibb.co/1fWbXCt/F-1.png' />
            <Avatar size='small' shape='square' title='Kozhin Dev' />
        </div>
        <div style={{display: 'flex', gridGap: '10px'}}>
            <Avatar size='middle' shape='square' src='https://i.ibb.co/1fWbXCt/F-1.png' />
            <Avatar size='middle' shape='square' title='Kozhin Dev' />
        </div>
        <div style={{display: 'flex', gridGap: '10px'}}>
            <Avatar size='large' shape='square' src='https://i.ibb.co/1fWbXCt/F-1.png' />
            <Avatar size='large' shape='square' title='Kozhin Dev' />
        </div>
        <div style={{display: 'flex', gridGap: '10px'}}>
            <Avatar size='x-large' shape='square' src='https://i.ibb.co/1fWbXCt/F-1.png' />
            <Avatar size='x-large' shape='square' title='Kozhin Dev' />
        </div>
    </div>
);
