import * as React from 'react';

import DateField from '../DateField';

/**
 * Выключенный или недоступный для использования.
 * @order 2
 * @col 6
 */

export default () => (
    <>
        <DateField
            label='Disabled'
            disabled
        />
    </>
);
