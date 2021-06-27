import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './basic';

/**
 * Search placeholder
 * @order 8
 * @col 6
 */
export default () => (
    <>
        <DropDownField
            label='Search Placeholder'
            autoComplete
            searchPlaceholder='Search...'
            items={items}
        />
    </>
);
