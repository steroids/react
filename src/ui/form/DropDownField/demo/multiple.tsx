import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './basic';

/**
 * Multiple
 * @order 6
 * @col 6
 */
export default () => (
    <>
        <DropDownField
            label='Multiple'
            multiple
            items={items}
        />
    </>
);
