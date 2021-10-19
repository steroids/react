import * as React from 'react';
import AutoCompleteField from '../AutoCompleteField';
import {items} from './basic';

/**
 * Выключенный AutoCompleteField также выключает Input.
 * @order 2
 * @col 6
 */

export default () => (
    <>
        <AutoCompleteField
            label='Disabled'
            disabled
            items={items}
        />
    </>
);
