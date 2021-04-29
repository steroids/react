import SwitcherField from '../SwitcherField';
import * as React from 'react';
import {items} from './basic';

/**
 * Disabled
 * @order 2
 * @col 6
 */
export default () => (
    <>
        <SwitcherField
            label='Disabled'
            items={items}
            disabled
        />
    </>
);
