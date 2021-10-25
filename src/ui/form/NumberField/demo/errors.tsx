import * as React from 'react';

import NumberField from '../NumberField';

/**
 * Обработка ошибок.
 * @order 6
 * @col 4
 */

export default () => (
    <>
        <NumberField label='Errors' errors={['Error 1 text', 'Error 2 text']} layout />
    </>
);
