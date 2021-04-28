import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './basic';

/**
 * Errors
 * @order 4
 * @col 6
 */
export default () => (
    <>
        <DropDownField
            label='Errors'
            errors={['Error 1 text', 'Error 2 text']}
            items={items}
        />
    </>
);
