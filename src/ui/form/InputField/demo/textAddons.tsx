import * as React from 'react';

import InputField from '../InputField';

/**
 * С дополнительным текстом слева и справа от поля ввода.
 * @order 8
 * @col 3
 */

export default () => (
    <>
        <InputField textBefore='http://' textAfter='.com' label='TextBefore and TextAfter' />
    </>
);
