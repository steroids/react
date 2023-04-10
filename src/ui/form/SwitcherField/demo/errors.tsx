import * as React from 'react';
import SwitcherField from '../SwitcherField';
import {items} from './basic';

/**
 * Обработка ошибок.
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
