import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './basic';

/**
 * Auto complete
 * @order 5
 * @col 6
 */
export default () => (
    <>
        <DropDownField
            label='Auto Complete'
            autoComplete
            items={items}
        />
    </>
);
