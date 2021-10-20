import * as React from 'react';
import Skeleton from '../Skeleton';

/**
 * Демонстрация двух видов анимации и трёх типов Skeleton.
 * @order 1
 * @col 3
 */

export default () => (
    <div
        style={{
            display: 'flex',
            gridGap: '20px',
        }}
    >
        <div style={{display: 'grid', gridGap: '10px'}}>
            <div style={{width: 100, height: 30}}>
                <Skeleton animation='wave' type='text' />
            </div>
            <div style={{width: 100, height: 100}}>
                <Skeleton animation='wave' type='rect' />
            </div>
            <div style={{width: 100, height: 100}}>
                <Skeleton animation='wave' type='circle' />
            </div>
        </div>
        <div style={{display: 'grid', gridGap: '10px'}}>
            <div style={{width: 100, height: 30}}>
                <Skeleton animation='pulse' type='text' />
            </div>
            <div style={{width: 100, height: 100}}>
                <Skeleton animation='pulse' type='rect' />
            </div>
            <div style={{width: 100, height: 100}}>
                <Skeleton animation='pulse' type='circle' />
            </div>
        </div>
    </div>
);
