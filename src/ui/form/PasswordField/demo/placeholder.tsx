import * as React from 'react';
import PasswordField from '../PasswordField';

/**
 * Сообщение пользователю для заполнения по контексту использования.
 * @order 4
 * @col 3
 */

export default () => (
    <>
        <PasswordField
            label='Placeholder'
            placeholder='Your password...'
        />
    </>
);
