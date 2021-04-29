import SwitcherField from '../SwitcherField';
import * as React from 'react';
import {items} from './basic';

/**
 * Errors
 * @order 4
 * @col 6
 */
export default () => (
    <>
        <SwitcherField
            label='Errors'
            items={items}
            errors={['Error 1 text', 'Error 2 text']}
        />
    </>
);
