import * as React from 'react';

import NumberField from '../NumberField';

/**
 * Выключенный или недоступный для использования.
 * @order 2
 * @col 3
 */

export default () => (
    <>
        <NumberField
            label='Disabled'
            disabled
        />
    </>
);
