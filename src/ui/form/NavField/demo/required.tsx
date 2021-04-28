import NavField from '../NavField';
import * as React from 'react';
import {items} from './basic';

/**
 * Required
 * @order 3
 * @col 8
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
