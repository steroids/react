import * as React from 'react';
import AutoCompleteField from '../AutoCompleteField';
import {items} from './basic';

/**
 * Required
 * @order 3
 * @col 6
 */
export default () => (
    <>
        <AutoCompleteField
            label='Required'
            required
            items={items}
        />
    </>
);
