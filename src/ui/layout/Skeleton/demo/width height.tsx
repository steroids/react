import * as React from 'react';
import Skeleton from '../Skeleton';

/**
 * Демонстрация задания кастомной ширины и высоты.
 * @order 2
 * @col 5
 */

export default () => (
    <div
        style={{
            display: 'flex',
            gridGap: '20px',
        }}
    >
        <div style={{display: 'flex', gridGap: '10px'}}>
            <Skeleton animation='wave' type='text' width={50} height={200} />
            <Skeleton animation='wave' type='circle' width={300} height={200} />
        </div>
    </div>
);
