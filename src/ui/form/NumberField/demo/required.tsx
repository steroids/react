import * as React from 'react';
import NumberField from '../NumberField';

/**
 * Как обязательное поле для заполнения.
 * @order 3
 * @col 3
 */

export default () => (
    <>
        <NumberField label='Required' required />
    </>
);
