import * as React from 'react';
import DateTimeField from '../DateTimeField';

/**
 * Icon
 * @order 5
 * @col 6
 */
export default () => (
    <>
        <DateTimeField
            label='Icon'
            dateProps={{
                icon: true,
            }}
        />
    </>
);
