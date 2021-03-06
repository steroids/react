import NavField from '../NavField';
import * as React from 'react';
import {items} from './basic';

/**
 * Errors
 * @order 4
 * @col 8
 */
export default () => (
    <>
        <NavField
            items={items}
            label='Errors'
            errors={['Error 1 text', 'Error 2 text']}
        />
    </>
);
