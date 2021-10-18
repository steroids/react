import * as React from 'react';
import NavField from '../NavField';
import {items} from './basic';

/**
 * Disabled
 * @order 2
 * @col 3
 */
export default () => (
    <>
        <NavField
            items={items}
            label='Disabled'
            disabled
        />
    </>
);
