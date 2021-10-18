import * as React from 'react';
import NavField from '../NavField';
import {items} from './basic';

/**
 * Required
 * @order 3
 * @col 3
 */
export default () => (
    <>
        <NavField
            items={items}
            label='Required'
            required
        />
    </>
);
