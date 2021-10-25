import * as React from 'react';
import NavField from '../NavField';
import {items} from './basic';

/**
 * Обработка ошибок.
 * @order 4
 * @col 3
 */

export default () => (
    <>
        <NavField
            items={items}
            label='Errors'
            errors={['Error 1 text', 'Error 2 text']}
            layout
        />
    </>
);
