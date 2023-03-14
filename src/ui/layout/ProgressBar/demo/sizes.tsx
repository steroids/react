import * as React from 'react';
import ProgressBar from '../ProgressBar';

/**
 * По-умолчанию имеется 3 вида размера.
 * @order 5
 * @col 12
 */

export default () => (
    <div style={{display: 'grid', gridGap: '10px', paddingRight: '10px'}}>
        <div style={{display: 'flex', gridGap: '10px'}}>
            <ProgressBar
                percent={10}
                size='small'
                type='circle'
            />
            <ProgressBar
                percent={50}
                size='medium'
                status='exception'
                type='circle'
            />
            <ProgressBar
                percent={100}
                size='large'
                status='success'
                type='circle'
            />
        </div>
        <div style={{maxWidth: '90%', display: 'grid', gridGap: '10px'}}>
            <ProgressBar
                percent={10}
                size='small'
            />
            <ProgressBar
                percent={50}
                size='medium'
                status='exception'
            />
            <ProgressBar
                percent={100}
                size='large'
                status='success'
            />
        </div>
    </div>
);
