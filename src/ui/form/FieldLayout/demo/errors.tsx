import * as React from 'react';
import InputField from '../../InputField';

/**
 * Errors
 * @order 3
 * @col 6
 */
export default () => (
    <>
        <InputField errors={['The field is filled incorrectly']} />
    </>
);
