import * as React from 'react';

import CheckboxListField from '../CheckboxListField';

/**
 * Обычный пример использования списка из CheckboxListField.
 * @order 1
 * @col 6
 */

export const items = [
    'test item 1',
    'test item 2',
    'test item 3',
];

export default () => (
    <>
        <CheckboxListField items={items} />
    </>
);
