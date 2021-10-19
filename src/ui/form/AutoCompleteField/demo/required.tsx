import * as React from 'react';
import AutoCompleteField from '../AutoCompleteField';
import {items} from './basic';

/**
 * Пример использования AutoCompleteField как обязательного поля для заполнения.
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
