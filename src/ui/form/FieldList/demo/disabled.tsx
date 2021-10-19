import * as React from 'react';

import FieldList from '../FieldList';
import Form from '../../Form';
import InputField from '../../InputField';
import NumberField from '../../NumberField';

/**
 * Выключенный или недоступный для использования.
 * @order 2
 * @col 12
 */

export default () => (
    <>
        <Form formId='FieldListForm'>
            <FieldList
                disabled
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
