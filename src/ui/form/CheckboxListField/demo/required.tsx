import * as React from 'react';
import CheckboxListField from '../CheckboxListField';
import {items} from './basic';

/**
 * Required
 * @order 3
 * @col 6
 */
export default () => (
    <>
        <CheckboxListField
            label='Required'
            items={items}
            required
        />
    </>
);
