import * as React from 'react';

import CheckboxListField from '../CheckboxListField';
import {items} from './basic';

/**
 * Disabled
 * @order 2
 * @col 6
 */
export default () => (
    <>
        <CheckboxListField
            label='Disabled'
            items={items}
            disabled
        />
    </>
);
