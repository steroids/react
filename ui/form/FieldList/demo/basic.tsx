import * as React from 'react';

import FieldList from '../FieldList';
import Form from '../../Form';
import InputField from '../../InputField';
import NumberField from '../../NumberField';
import AutoCompleteField from '../../AutoCompleteField';
import DropDownField from '../../DropDownField';

const categories = ['Aaa', 'Bbb', 'Ccc', 'Ddd'];
const modes = ['Smart', 'Full'];

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
                    {
                        label: 'Category',
                        attribute: 'category',
                        component: DropDownField,
                        items: categories,
                    },
                    {
                        label: 'Mode',
                        attribute: 'mode',
                        component: AutoCompleteField,
                        items: modes,
                    },
                ]}
            />
        </Form>
    </>
);