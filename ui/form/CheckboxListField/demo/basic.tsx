import * as React from 'react';

import CheckboxListField from '../CheckboxListField';

/**
 * Basic
 * @order 1
 * @col 6
 */
export default () => (
    <>
        <CheckboxListField
            items={[
                'test item 1',
                'test item 2',
                'test item 3',
            ]}
        />
    </>
);
