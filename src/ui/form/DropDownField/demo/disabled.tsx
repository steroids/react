import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './basic';

/**
 * Disabled
 * @order 2
 * @col 6
 */
export default () => (
    <>
        <DropDownField
            label='Disabled'
            disabled
            items={items}
        />
    </>
);
