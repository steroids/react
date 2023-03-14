import * as React from 'react';
import ProgressBar from '../ProgressBar';

/**
 * Компонент имеет 3 базовых вида статуса.
 * @order 1
 * @col 6
 */

export default () => (
    <div>
        <ProgressBar
            percent={10}
            size='small'
        />
        <ProgressBar
            percent={50}
            size='small'
            status='exception'
        />
        <ProgressBar
            percent={100}
            size='small'
            status='success'
        />
    </div>
);
