import * as React from 'react';
import Field from '../Field';

/**
 * Field with model
 * @order 2
 * @col 6
 */
export default () => (
    <>
        <Field
            attribute='category'
            model={{
                attributes: [
                    {
                        attribute: 'category',
                        label: 'Category',
                        field: 'DropDownField',
                        fieldProps: {
                            items: ['items_1', 'items_2', 'items_3'],
                        },
                    },
                ],
            }}
        />
    </>
);
