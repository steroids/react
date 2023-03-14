import * as React from 'react';

import NumberField from '../NumberField';

/**
 * Сообщение пользователю для заполнения по контексту использования.
 * @order 4
 * @col 3
 */

export default () => (
    <>
        <NumberField
            label='Placeholder'
            placeholder='Your number...'
        />
    </>
);
