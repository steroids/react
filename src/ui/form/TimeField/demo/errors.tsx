import * as React from 'react';
import TimeField from '../TimeField';

/**
 * Errors
 * @order 4
 * @col 3
 */
export default () => (
    <>
        <TimeField label='Errors' errors={['Error 1 text', 'Error 2 text']} />
    </>
);
