import * as React from 'react';
import DateField from '../DateField';

/**
 * Как обязательное поле для заполнения.
 * @order 3
 * @col 6
 */

export default () => (
    <>
        <DateField
            label='Required'
            required
        />
    </>
);
