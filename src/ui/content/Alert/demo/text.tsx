import * as React from 'react';
import Alert from '../Alert';

/**
 * Text with icon and without icon
 * @order 3
 * @col 12
 */

export default () => (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px'}}>
        <div style={{display: 'grid', gridGap: '20px'}}>
            <Alert
                type='success'
                description='Detailed description and advice about successful copywriting.'
            />
            <Alert
                type='info'
                description='Additional description and information about copywriting.'
            />
            <Alert
                type='warning'
                showClose
                description='This is a warning notice about copywriting.'
            />
            <Alert
                type='error'
                description='This is an error message about copywriting.'
            />
        </div>
        <div style={{display: 'grid', gridGap: '20px'}}>
            <Alert
                showIcon={false}
                type='success'
                description='Detailed description and advice about successful copywriting.'
            />
            <Alert
                showIcon={false}
                type='info'
                description='Additional description and information about copywriting.'
            />
            <Alert
                showIcon={false}
                type='warning'
                showClose
                description='This is a warning notice about copywriting.'
            />
            <Alert
                showIcon={false}
                type='error'
                description='This is an error message about copywriting.'
            />
        </div>
    </div>
);
