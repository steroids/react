import * as React from 'react';
import AutoCompleteField from '../AutoCompleteField';
import {items} from './basic';

/**
 * Пример обработки ошибок в поле.
 * @order 4
 * @col 6
 */
export default () => (
    <>
        <AutoCompleteField
            label='Errors'
            items={items}
            errors={['Error 1 text', 'Error 2 text']}
        />
    </>
);
