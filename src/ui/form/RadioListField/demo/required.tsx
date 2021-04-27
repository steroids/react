import * as React from 'react';
import RadioListField from '../RadioListField';
import {items} from './basic';

/**
 * Required
 * @order 3
 * @col 6
 */
export default () => (
    <>
        <RadioListField
            label='Required'
            items={items}
            required
        />
    </>
);
