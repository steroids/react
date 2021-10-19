import * as React from 'react';
import RadioListField from '../RadioListField';
import {items} from './basic';

/**
 * Выключенный или недоступный для использования.
 * @order 2
 * @col 6
 */

export default () => (
    <>
        <RadioListField
            label='Disabled'
            disabled
            items={items}
        />
    </>
);
