import * as React from 'react';

import FieldList from '../FieldList';
import Form from '../../Form';
import InputField from '../../InputField';
import NumberField from '../../NumberField';

/**
 * Basic
 * @order 1
 * @col 12
 */
export default () => (
    <>
        <Form formId='FieldListForm'>
            <FieldList
                attribute='items'
                label='Items'
                initialRowsCount={2}
                items={[
                    {
                        attribute: 'id',
                        type: 'hidden',
                        component: InputField,
                    },
                    {
                        label: 'Name',
                        attribute: 'name',
                        component: InputField,
                    },
                    {
                        label: 'Description',
                        attribute: 'description',
                        component: InputField,
                    },
                    {
                        label: 'Amount',
                        attribute: 'amount',
                        component: NumberField,
                    },
                ]}
            />
        </Form>
    </>
);
