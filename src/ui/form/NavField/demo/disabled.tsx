import NavField from '@steroidsjs/core/ui/form/NavField/NavField';
import * as React from 'react';
import {items} from '@steroidsjs/core/ui/form/NavField/demo/basic';

/**
 * Disabled
 * @order 2
 * @col 8
 */
export default () => (
    <>
        <NavField
            items={items}
            label='Disabled'
            disabled
        />
    </>
);
