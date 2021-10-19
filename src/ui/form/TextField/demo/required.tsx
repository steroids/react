import * as React from 'react';
import TextField from '../TextField';

/**
 * Как обязательное для заполнения.
 * @order 3
 * @col 3
 */

export default () => (
    <>
        <TextField label='Required' required />
    </>
);
