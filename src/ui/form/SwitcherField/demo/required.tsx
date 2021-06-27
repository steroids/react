import SwitcherField from '../SwitcherField';
import * as React from 'react';
import {items} from './basic';

/**
 * Required
 * @order 3
 * @col 6
 */
export default () => (
    <>
        <SwitcherField
            label='Required'
            items={items}
            required
        />
    </>
);
