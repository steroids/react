import NavField from '@steroidsjs/core/ui/form/NavField/NavField';
import * as React from 'react';
import {items} from '@steroidsjs/core/ui/form/NavField/demo/basic';

/**
 * Required
 * @order 3
 * @col 8
 */
export default () => (
    <>
        <NavField
            items={items}
            label='Required'
            required
        />
    </>
);
