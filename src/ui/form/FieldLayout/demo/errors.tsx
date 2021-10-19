import * as React from 'react';
import InputField from '../../InputField';
import FieldLayout from '../FieldLayout';

/**
 * Обработка ошибок.
 * @order 3
 * @col 6
 */

export default () => (
    <FieldLayout errors={['The field is filled incorrectly']}>
        <InputField />
    </FieldLayout>
);
