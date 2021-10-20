import * as React from 'react';
import ProgressBar from '../ProgressBar';

/**
 * Имеется два типа: 'circle', 'line'. По-умолчанию задается 'line'.
 * @order 3
 * @col 6
 */

export default () => (
    <div style={{display: 'grid', gridGap: '10px', paddingRight: '10px'}}>
        <div style={{display: 'flex', gridGap: '10px'}}>
            <ProgressBar percent={10} size='small' type='circle' />
            <ProgressBar percent={50} size='small' status='exception' type='circle' />
            <ProgressBar percent={100} size='small' status='success' type='circle' />
        </div>
        <div style={{maxWidth: '90%'}}>
            <ProgressBar percent={10} size='small' />
            <ProgressBar percent={50} size='small' status='exception' />
            <ProgressBar percent={100} size='small' status='success' />
        </div>
    </div>
);
