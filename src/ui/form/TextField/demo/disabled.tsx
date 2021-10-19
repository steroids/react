import * as React from 'react';
import TextField from '../TextField';

/**
 * Выключенный или недоступный для использования.
 * @order 2
 * @col 3
 */
export default () => (
    <>
        <TextField label='Disabled' disabled />
    </>
);
