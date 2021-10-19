import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './basic';

/**
 * Как обязательное поле для заполнения.
 * @order 3
 * @col 6
 */

export default () => (
    <>
        <DropDownField
            label='Required'
            required
            items={items}
        />
    </>
);
