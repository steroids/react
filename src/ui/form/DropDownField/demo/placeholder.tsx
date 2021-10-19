import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './basic';

/**
 * С полем для поиска выбора из выпадающего списка.
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
