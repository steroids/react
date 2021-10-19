import * as React from 'react';

import InputField from '../InputField';

/**
 * С дополнительным текстом с рамками слева и справа от поля ввода.
 * @order 7
 * @col 3
 */

export default () => (
    <>
        <InputField addonBefore='http://' addonAfter='.com' label='AddonBefore and AddonAfter' />
    </>
);
