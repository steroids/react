import NavField from '../NavField';
import * as React from 'react';
import {items} from './basic';

/**
 * Disabled
 * @order 2
 * @col 8
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
