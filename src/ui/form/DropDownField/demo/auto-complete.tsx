import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './basic';

/**
 * Использование свойства самозаполнения.
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
