import * as React from 'react';

import CheckboxListField from '../CheckboxListField';
import {items} from './basic';

/**
 * Список с недоступными для заполнения полями.
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
