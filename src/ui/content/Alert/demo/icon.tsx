import * as React from 'react';
import Alert from '../Alert';

/**
 * Header with icon and without icon
 * @order 1
 * @col 12
 */

export default () => (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px'}}>
        <div style={{display: 'grid', gridGap: '20px'}}>
            <Alert type='success' message='Success Tips' />
            <Alert type='info' message='Information Notes' />
            <Alert type='warning' message='Warning' showClose />
            <Alert type='error' message='Error' />
        </div>
        <div style={{display: 'grid', gridGap: '20px'}}>
            <Alert showIcon={false} type='success' message='Success Tips' />
            <Alert showIcon={false} type='info' message='Information Notes' />
            <Alert showIcon={false} type='warning' message='Warning' showClose />
            <Alert showIcon={false} type='error' message='Error' />
        </div>
    </div>
);
