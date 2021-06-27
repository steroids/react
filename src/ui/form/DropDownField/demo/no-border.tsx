import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './basic';

/**
 * No border
 * @order 7
 * @col 6
 */
export default () => (
    <div
        style={{width: '100px'}}
    >
        <DropDownField
            label='No border'
            noBorder
            selectFirst
            items={items}
        />
    </div>
);
