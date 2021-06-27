import * as React from 'react';

import InputField from '../InputField';

/**
 * Errors
 * @order 5
 * @col 6
 */
export default () => (
    <>
        <InputField label='Errors' errors={['Error 1 text', 'Error 2 text']} />
    </>
);
