import * as React from 'react';
import DateTimeField from '../DateTimeField';

/**
 * Placeholder
 * @order 6
 * @col 6
 */
export default () => (
    <>
        <DateTimeField
            label='Placeholder'
            dateProps={{
                placeholder: 'Your date...',
            }}
            timeProps={{
                placeholder: 'Your time...',
            }}
        />
    </>
);
