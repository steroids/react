import NavField from '@steroidsjs/core/ui/form/NavField/NavField';
import * as React from 'react';
import {items} from '@steroidsjs/core/ui/form/NavField/demo/basic';

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
