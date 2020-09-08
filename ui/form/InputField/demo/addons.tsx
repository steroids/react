import * as React from 'react';

import InputField from '../InputField';

/**
 * Addons
 * @order 6
 * @col 3
 */
export default () => (
    <>
        <InputField addonBefore='http://' addonAfter='.com' label='AddonBefore and AddonAfter'/>
    </>
);