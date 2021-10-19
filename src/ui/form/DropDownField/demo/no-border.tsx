import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './basic';

/**
 * Без полей и рамок.
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
