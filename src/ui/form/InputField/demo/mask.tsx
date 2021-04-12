import * as React from 'react';

import InputField from '../InputField';

/**
 * Mask
 * @order 7
 * @col 3
 */
export default () => (
    <>
        <InputField
            label='Mask'
            maskProps={{
                mask: '+7 (999) 999-99-99'
            }}
        />
    </>
);
