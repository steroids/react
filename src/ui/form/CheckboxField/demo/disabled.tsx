import * as React from 'react';

import CheckboxField from '../CheckboxField';

/**
 * Выключенный или недоступный CheckboxField для заполнения.
 * @order 2
 * @col 4
 */

export default () => (
    <>
        <CheckboxField label='Disabled' disabled />
    </>
);
