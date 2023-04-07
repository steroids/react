import * as React from 'react';
import DateField from '../DateField';

/**
 * Обработка ошибок.
 * @order 4
 * @col 6
 */

export default () => (
    <>
        <DateField
            label='Errors'
            errors={['Error 1 text', 'Error 2 text']}
        />
    </>
);
