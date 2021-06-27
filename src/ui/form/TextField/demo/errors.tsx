import * as React from 'react';
import TextField from '../TextField';

/**
 * Errors
 * @order 4
 * @col 3
 */
export default () => (
    <>
        <TextField label='Errors' errors={['Error 1 text', 'Error 2 text']} />
    </>
);
