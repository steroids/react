import * as React from 'react';

import CheckboxListField from '../CheckboxListField';

export const items = [
    'test item 1',
    'test item 2',
    'test item 3',
];

/**
 * Basic
 * @order 1
 * @col 6
 */
export default () => (
    <>
        <CheckboxListField items={items} />
    </>
);
