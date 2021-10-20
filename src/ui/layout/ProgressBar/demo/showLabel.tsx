import * as React from 'react';
import ProgressBar from '../ProgressBar';

/**
 * Можно убрать иконку.
 * @order 4
 * @col 6
 */

export default () => (
    <div style={{display: 'grid', gridGap: '10px', paddingRight: '10px'}}>
        <div style={{display: 'flex', gridGap: '10px'}}>
            <ProgressBar percent={10} size='small' type='circle' showLabel={false} />
            <ProgressBar percent={50} size='small' status='exception' type='circle' showLabel={false} />
            <ProgressBar percent={100} size='small' status='success' type='circle' showLabel={false} />
        </div>
        <div style={{maxWidth: '90%', display: 'grid', gridGap: '10px'}}>
            <ProgressBar percent={10} size='small' showLabel={false} />
            <ProgressBar percent={50} size='small' status='exception' showLabel={false} />
            <ProgressBar percent={100} size='small' status='success' showLabel={false} />
        </div>
    </div>
);
