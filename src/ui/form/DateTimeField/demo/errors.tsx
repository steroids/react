import * as React from 'react';
import DateTimeField from '../DateTimeField';

/**
 * Errors
 * @order 4
 * @col 6
 */
export default () => (
    <>
        <DateTimeField label='Errors' errors={['Error 1 text', 'Error 2 text']} />
    </>
);
