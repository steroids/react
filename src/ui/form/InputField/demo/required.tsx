import * as React from 'react';
import InputField from '../InputField';

/**
 * Как обязательное поле для заполнения.
 * @order 3
 * @col 3
 */
export default () => (
    <>
        <InputField label='Required' required />
    </>
);
