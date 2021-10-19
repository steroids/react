import * as React from 'react';
import InputField from '../../InputField';
import FieldLayout from '../FieldLayout';

/**
 * Как обязательное поле для заполнения.
 * @order 2
 * @col 6
 */

export default () => (
    <FieldLayout required>
        <InputField
            required
            label='Required'
        />
    </FieldLayout>
);
