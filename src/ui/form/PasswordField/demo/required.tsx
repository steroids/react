import * as React from 'react';
import PasswordField from '../PasswordField';

/**
 * Как обязательное поле для заполнения.
 * @order 3
 * @col 3
 */

export default () => (
    <>
        <PasswordField label='Required' required />
    </>
);
