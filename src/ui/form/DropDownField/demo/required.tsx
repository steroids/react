import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './basic';

/**
 * Required
 * @order 3
 * @col 6
 */
export default () => (
    <>
        <DropDownField
            label='Required'
            required
            items={items}
        />
    </>
);
