import * as React from 'react';

import InputField from '../InputField';

/**
 * С использованием маски для ввода номера телефона
 * @order 6
 * @col 3
 */

export default () => (
    <>
        <InputField
            label="Mask"
            maskProps={{
                mask: '+7 (999) 999-99-99',
            }}
        />
    </>
);
